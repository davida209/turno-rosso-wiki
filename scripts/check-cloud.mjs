import assert from 'node:assert/strict'
import { randomUUID,randomBytes } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { writeFile } from 'node:fs/promises'
process.loadEnvFile('.env.local')
const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_ANON_KEY
const admin=createClient(url,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}})
const created=[]
try{
 const users=[]
 for(let i=0;i<2;i++){
  const email=`qa-${Date.now()}-${i}@example.invalid`,password=randomBytes(24).toString('base64url')
  const {data,error}=await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{display_name:`Prueba ${i+1}`}})
  if(error)throw error;created.push(data.user.id)
  const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
  const result=await client.auth.signInWithPassword({email,password});assert.ifError(result.error)
  users.push({id:data.user.id,email,password,client})
 }
 const [a,b]=users;const id=randomUUID()
 assert.ifError((await a.client.from('notes').insert({id,user_id:a.id,title:'Prueba CRUD',body:'Privada',category:'general'})).error)
 let response=await a.client.from('notes').select('*').eq('id',id);assert.ifError(response.error);assert.equal(response.data.length,1)
 response=await b.client.from('notes').select('*').eq('id',id);assert.ifError(response.error);assert.equal(response.data.length,0)
 response=await b.client.from('notes').insert({id:randomUUID(),user_id:a.id,title:'No autorizado',body:'',category:'general'});assert.ok(response.error)
 assert.ifError((await a.client.from('notes').update({title:'Editada'}).eq('id',id)).error)
 assert.equal((await a.client.from('notes').select('title').eq('id',id).single()).data.title,'Editada')
 response=await a.client.from('game_runs').insert({id:randomUUID(),user_id:a.id,score:999999,result:'won',duration_seconds:100,verification:'verified',game_version:'test'});assert.ok(response.error)
 assert.ifError((await a.client.from('notes').delete().eq('id',id)).error)
 assert.equal((await a.client.from('notes').select('*').eq('id',id)).data.length,0)
 const publicClient=createClient(url,key,{auth:{persistSession:false}})
 response=await publicClient.from('leaderboard').select('*');assert.ifError(response.error)
 response=await publicClient.from('notes').select('*');assert.ok(response.error)
 const fixture={user_id:a.id,result:'won',duration_seconds:300,game_version:'qa'}
 const verifiedId=randomUUID(),offlineId=randomUUID()
 assert.ifError((await admin.from('game_runs').insert([{...fixture,id:verifiedId,score:200,verification:'verified'},{...fixture,id:offlineId,score:900000,verification:'offline'}])).error)
 let board=await publicClient.from('leaderboard').select('*').eq('player_id',a.id).single();assert.ifError(board.error);assert.equal(board.data.best_score,200);assert.equal(board.data.played,1)
 assert.ifError((await a.client.from('profiles').update({display_name:'Perfil actualizado'}).eq('id',a.id)).error)
 board=await publicClient.from('leaderboard').select('*').eq('player_id',a.id).single();assert.equal(board.data.display_name,'Perfil actualizado')
 assert.ifError((await admin.from('game_runs').delete().eq('user_id',a.id)).error)
 board=await publicClient.from('leaderboard').select('*').eq('player_id',a.id);assert.equal(board.data.length,0)
 console.log('PASS: only server-verified runs enter ranking; offline results excluded; profile/ranking triggers')
 console.log('PASS: real Auth, GET/POST/PATCH/DELETE, cross-account privacy, anonymous restrictions, score write denied, public ranking')
 // The browser suite may request a temporary disposable account, without printing credentials.
 if(process.argv.includes('--keep-one')){
  await writeFile('../../work/cloud-test.json',JSON.stringify({id:a.id,email:a.email,password:a.password,url,key}))
  created.splice(created.indexOf(a.id),1)
  console.log('Disposable browser test account prepared')
 }
}finally{for(const id of created)await admin.auth.admin.deleteUser(id)}
