import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'
export function adminClient(){return createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}})}
export function json(value,status=200){return Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}
export async function identify(request,db){
 const token=request.headers.get('authorization')?.replace(/^Bearer /,'')
 if(!token)return null
 const {data,error}=await db.auth.getUser(token)
 return error?null:data.user
}
export function validSubscription(sub){
 if(!sub||typeof sub.endpoint!=='string'||sub.endpoint.length>2000)return false
 try{
  const u=new URL(sub.endpoint)
  const host=u.hostname.toLowerCase()
  const allowed=host==='fcm.googleapis.com'||host==='web.push.apple.com'||host==='updates.push.services.mozilla.com'||host.endsWith('.notify.windows.com')||host.endsWith('.push.services.mozilla.com')
  return allowed&&u.protocol==='https:'&&!u.port&&!u.username&&!u.password&&/^[A-Za-z0-9_-]{80,100}$/.test(sub.keys?.p256dh||'')&&/^[A-Za-z0-9_-]{20,30}$/.test(sub.keys?.auth||'')
 }catch{return false}
}
export async function deliver(db,row,payload){
 if(!validSubscription(row.subscription))return false
 webpush.setVapidDetails('https://prototipo-wiki-ten.vercel.app',process.env.VAPID_PUBLIC_KEY,process.env.VAPID_PRIVATE_KEY)
 try{
  await webpush.sendNotification(row.subscription,JSON.stringify(payload),{TTL:3600,timeout:10000})
  return true
 }catch(e){
  if(e.statusCode===404||e.statusCode===410)await db.from('push_subscriptions').delete().eq('id',row.id)
  console.error('push_delivery_failed',{status:e.statusCode||'network'})
  return false
 }
}
