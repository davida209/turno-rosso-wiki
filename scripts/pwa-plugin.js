import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { createHash } from 'node:crypto'
export default function pwaPlugin(){
 return {name:'turno-rosso-pwa',apply:'build',async closeBundle(){
  const root='dist'
  async function walk(dir){const entries=await readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]))).flat()}
  const paths=(await walk(root)).filter(p=>!p.endsWith('sw.js')).sort()
  const digest=createHash('sha256');for(const p of paths)digest.update(await readFile(p))
  const revision=digest.digest('hex').slice(0,12)
  const urls=paths.map(p=>'/'+relative(root,p).replaceAll('\\','/'))
  const template=await readFile('scripts/sw-template.js','utf8')
  await writeFile(join(root,'sw.js'),template.replace('__REVISION__',revision).replace('__PRECACHE__',JSON.stringify(urls)))
 }}
}
