import { timingSafeEqual } from 'node:crypto'
import { adminClient,deliver,json } from '../server/push.js'
export async function GET(request){
 const actual=Buffer.from(request.headers.get('authorization')||'')
 const expected=Buffer.from(`Bearer ${process.env.CRON_SECRET||''}`)
 if(!process.env.CRON_SECRET||actual.length!==expected.length||!timingSafeEqual(actual,expected))return json({error:'No autorizado.'},401)
 try{
  const db=adminClient();const date=new Date().toISOString().slice(0,10)
  let sent=0,failed=0
  // Claim before sending so repeated cron invocations don't duplicate the reminder.
  const {data,error}=await db.from('push_subscriptions').update({last_sent_date:date}).eq('daily_reminder',true).or(`last_sent_date.is.null,last_sent_date.lt.${date}`).select('*')
  if(error)throw error
  for(let start=0;start<data.length;start+=10){
   const result=await Promise.all(data.slice(start,start+10).map(row=>deliver(db,row,{title:'Hora de preparar tu turno',body:'Revisa tus notas, repasa las mecánicas y vuelve a Turno Rosso.',url:'/notas'})))
   sent+=result.filter(Boolean).length;failed+=result.filter(x=>!x).length
  }
  console.log('daily_reminders',{sent,failed})
  return json({sent,failed})
 }catch(e){console.error('cron_failed',{code:e.code||'unknown'});return json({error:'No se pudieron procesar los avisos.'},503)}
}
