import assert from 'node:assert/strict'
import { createClient } from '@supabase/supabase-js'
import { readFile } from 'node:fs/promises'
import { createECDH, randomBytes } from 'node:crypto'
process.loadEnvFile('.env.local')
const base=process.argv[2];if(!base)throw new Error('Supply exact preview URL')
const credentials=JSON.parse(await readFile('../../work/cloud-test.json','utf8'))
const cloud=createClient(credentials.url,credentials.key,{auth:{persistSession:false,autoRefreshToken:false}})
const {data,error}=await cloud.auth.signInWithPassword({email:credentials.email,password:credentials.password});assert.ifError(error)
const access=data.session.access_token
async function call(path,{action,body={},auth=access,method='POST'}={}){
 const headers={'x-vercel-trusted-oidc-idp-token':process.env.VERCEL_OIDC_TOKEN}
 if(auth)headers.Authorization=`Bearer ${auth}`
 if(method==='POST')headers['Content-Type']='application/json'
 const response=await fetch(base+path,{method,headers,...(method==='POST'?{body:JSON.stringify({action,...body})}:{})})
 const value=await response.json();return {status:response.status,value}
}
let r=await call('/api/push',{method:'GET',auth:null});assert.equal(r.status,200);assert.ok(r.value.publicKey)
r=await call('/api/push',{action:'status',auth:null});assert.equal(r.status,401)
r=await call('/api/push',{action:'status'});assert.equal(r.status,200)
r=await call('/api/push',{action:'subscribe',body:{subscription:{endpoint:'https://127.0.0.1/private'}}});assert.equal(r.status,400)
const ecdh=createECDH('prime256v1');ecdh.generateKeys()
const subscription={endpoint:'https://fcm.googleapis.com/fcm/send/disposable-qa-'+randomBytes(12).toString('hex'),keys:{p256dh:ecdh.getPublicKey().toString('base64url'),auth:randomBytes(16).toString('base64url')}}
try{
 r=await call('/api/push',{action:'subscribe',body:{subscription}});assert.equal(r.status,200)
 r=await call('/api/push',{action:'reminder',body:{enabled:true}});assert.equal(r.status,200)
 r=await call('/api/push',{action:'status'});assert.equal(r.value.daily,true)
}finally{await call('/api/push',{action:'unsubscribe'})}
r=await call('/api/reminders',{method:'GET',auth:null});assert.equal(r.status,401)
r=await call('/api/reminders',{method:'GET',auth:process.env.CRON_SECRET});assert.equal(r.status,200);assert.equal(r.value.sent,0)
console.log('PASS: deployed functions, Auth checks, invalid endpoint rejection, subscription CRUD, reminder preference and protected cron. No synthetic push sent.')
