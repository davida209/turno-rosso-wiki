import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
process.loadEnvFile('.env.local')
const origin='https://prototipo-wiki-ten.vercel.app'
const admin=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}})
const client=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_ANON_KEY,{auth:{persistSession:false,autoRefreshToken:false}})
const email=`qa-auth-${Date.now()}@example.invalid`
const password=randomBytes(24).toString('base64url')
let id
try{
 const created=await admin.auth.admin.createUser({email,password,email_confirm:false,user_metadata:{display_name:'Prueba de acceso'}})
 assert.ifError(created.error);id=created.data.user.id
 const signup=await admin.auth.admin.generateLink({type:'signup',email,password,options:{redirectTo:origin+'/cuenta'}})
 assert.ifError(signup.error)
 assert.equal(new URL(signup.data.properties.action_link).searchParams.get('redirect_to'),origin+'/cuenta')
 const confirmation=await fetch(signup.data.properties.action_link,{redirect:'manual'})
 const callback=new URL(confirmation.headers.get('location'))
 assert.equal(callback.origin+callback.pathname,origin+'/cuenta')
 assert.ok(new URLSearchParams(callback.hash.slice(1)).get('access_token'),'Confirmation must issue a session')
 assert.ifError((await client.auth.signInWithPassword({email,password})).error)
 console.log('PASS: signup confirmation redirects to the PWA and confirmed account signs in (no email sent)')
 const recovery=await admin.auth.admin.generateLink({type:'recovery',email,options:{redirectTo:origin+'/cuenta'}})
 assert.ifError(recovery.error)
 const reset=await fetch(recovery.data.properties.action_link,{redirect:'manual'})
 const resetCallback=new URL(reset.headers.get('location'))
 assert.equal(resetCallback.origin+resetCallback.pathname,origin+'/cuenta')
 const params=new URLSearchParams(resetCallback.hash.slice(1))
 assert.equal(params.get('type'),'recovery')
 assert.ifError((await client.auth.setSession({access_token:params.get('access_token'),refresh_token:params.get('refresh_token')})).error)
 const updated=randomBytes(24).toString('base64url')
 assert.ifError((await client.auth.updateUser({password:updated})).error)
 assert.ifError((await client.auth.signInWithPassword({email,password:updated})).error)
 console.log('PASS: recovery link, temporary password reset and subsequent sign-in')
 const defaults=await admin.auth.admin.generateLink({type:'recovery',email})
 assert.ifError(defaults.error);assert.equal(new URL(defaults.data.properties.action_link).searchParams.get('redirect_to'),origin)
 const rejected=await admin.auth.admin.generateLink({type:'recovery',email,options:{redirectTo:'https://invalid.example.invalid/callback'}})
 assert.ifError(rejected.error);assert.equal(new URL(rejected.data.properties.action_link).searchParams.get('redirect_to'),origin)
 console.log('PASS: public Site URL is the default; unapproved redirect falls back to the PWA')
}finally{if(id){await client.auth.signOut({scope:'local'});const deleted=await admin.auth.admin.deleteUser(id);assert.ifError(deleted.error);console.log('Disposable auth test account removed')}}
