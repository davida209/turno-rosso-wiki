import { adminClient, deliver, identify, json, validSubscription } from '../server/push.js'
export function GET(){return json({publicKey:process.env.VAPID_PUBLIC_KEY||null})}
export async function POST(request){
 try{
  const origin=request.headers.get('origin')
  if(origin&&origin!==new URL(request.url).origin)return json({error:'Origen no permitido.'},403)
  if(!request.headers.get('content-type')?.includes('application/json'))return json({error:'Formato no admitido.'},415)
  if(Number(request.headers.get('content-length')||0)>6000)return json({error:'Solicitud demasiado grande.'},413)
  const raw=await request.text();if(raw.length>6000)return json({error:'Solicitud demasiado grande.'},413)
  let input;try{input=JSON.parse(raw)}catch{return json({error:'Solicitud inválida.'},400)}
  const db=adminClient();const user=await identify(request,db)
  if(!user)return json({error:'Inicia sesión para gestionar los avisos.'},401)
  const {action}=input
  if(action==='status'){
   const {data,error}=await db.from('push_subscriptions').select('daily_reminder').eq('user_id',user.id)
   if(error)throw error
   return json({subscribed:data.length>0,daily:data.some(row=>row.daily_reminder)})
  }
  if(action==='subscribe'){
   if(!validSubscription(input.subscription))return json({error:'La suscripción del dispositivo no es válida.'},400)
   // Limit to five devices. Subscription credentials never leave this server/table.
   const {count,error:countError}=await db.from('push_subscriptions').select('id',{count:'exact',head:true}).eq('user_id',user.id)
   if(countError)throw countError
   const {data:existing}=await db.from('push_subscriptions').select('id,user_id').eq('endpoint',input.subscription.endpoint).maybeSingle()
   if((count||0)>=5&&existing?.user_id!==user.id)return json({error:'Ya tienes cinco dispositivos registrados.'},409)
   // Preserve user preferences on re-subscribe; a different account starts with reminders off.
   const row={user_id:user.id,endpoint:input.subscription.endpoint,subscription:input.subscription}
   if(existing&&existing.user_id!==user.id){row.daily_reminder=false;row.last_sent_date=null;row.last_test_at=null}
   const {error}=await db.from('push_subscriptions').upsert(row,{onConflict:'endpoint'})
   if(error)throw error
   return json({ok:true})
  }
  if(action==='detach'){
   if(typeof input.endpoint!=='string')return json({error:'Dispositivo no válido.'},400)
   const {error}=await db.from('push_subscriptions').delete().eq('user_id',user.id).eq('endpoint',input.endpoint)
   if(error)throw error;return json({ok:true})
  }
  if(action==='unsubscribe'){
   const {error}=await db.from('push_subscriptions').delete().eq('user_id',user.id)
   if(error)throw error;return json({ok:true})
  }
  if(action==='reminder'){
   if(typeof input.enabled!=='boolean')return json({error:'Preferencia inválida.'},400)
   const {error}=await db.from('push_subscriptions').update({daily_reminder:input.enabled}).eq('user_id',user.id)
   if(error)throw error;return json({ok:true})
  }
  if(action==='test'){
   // Atomic per-device cooldown, persisted across serverless invocations.
   const cutoff=new Date(Date.now()-60000).toISOString()
   const {data,error}=await db.from('push_subscriptions').update({last_test_at:new Date().toISOString()}).eq('user_id',user.id).or(`last_test_at.is.null,last_test_at.lt.${cutoff}`).select('*')
   if(error)throw error
   if(!data.length)return json({error:'Activa los avisos o espera un minuto entre pruebas.'},429)
   const sent=await Promise.all(data.map(row=>deliver(db,row,{title:'Tu turno te espera',body:'Aviso push de Turno Rosso. También puedes recibirlo con la app cerrada.',url:'/notas'})))
   if(!sent.some(Boolean))return json({error:'No se pudo entregar. Reactiva los avisos y vuelve a probar.'},502)
   return json({ok:true})
  }
  return json({error:'Acción no válida.'},400)
 }catch(e){console.error('push_api_failed',{code:e.code||'unknown'});return json({error:'El servicio de avisos no está disponible ahora.'},503)}
}
