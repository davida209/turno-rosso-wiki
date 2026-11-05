import webpush from 'web-push'
import { randomBytes } from 'node:crypto'
import { readFile,writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
const file='.env.push'
let values
try{values=JSON.parse(await readFile(file,'utf8'))}catch{const pair=webpush.generateVAPIDKeys();values={VAPID_PUBLIC_KEY:pair.publicKey,VAPID_PRIVATE_KEY:pair.privateKey,CRON_SECRET:randomBytes(32).toString('hex')};await writeFile(file,JSON.stringify(values))}
for(const [key,value]of Object.entries(values)){
 await new Promise((resolve,reject)=>{
  const child=spawn('npx.cmd',['--yes','vercel@latest','env','add',key,'--environment','production,preview,development','--force','--yes','--scope','team_dQ6eSoLgR2ywWcU5ELceLZ8n'],{shell:true,stdio:['pipe','pipe','pipe']})
  let stderr='';child.stderr.on('data',d=>{stderr+=d});child.stdin.end(value)
  child.on('error',reject);child.on('close',code=>{if(code===0){console.log(`${key} configured`);resolve()}else reject(new Error(`${key} configuration failed (${code})`))})
 })
}
