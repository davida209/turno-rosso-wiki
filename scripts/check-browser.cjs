const {chromium}=require('playwright')
const fs=require('node:fs')
const assert=require('node:assert/strict')
let debugPage;
const base=process.env.PWA_TEST_URL||'http://127.0.0.1:4174'
const credentials=JSON.parse(fs.readFileSync('../../work/cloud-test.json','utf8'))
;(async()=>{
 const cloud=require('@supabase/supabase-js').createClient(credentials.url,credentials.key,{auth:{persistSession:false,autoRefreshToken:false}});const login=await cloud.auth.signInWithPassword({email:credentials.email,password:credentials.password});assert.ifError(login.error);assert.ifError((await cloud.from('notes').delete().eq('user_id',credentials.id)).error)

 const browser=await chromium.launch({channel:process.env.PWA_BROWSER||'msedge',headless:true})
 const context=await browser.newContext({viewport:{width:390,height:900},permissions:['notifications']})
 const page=await context.newPage();debugPage=page;page.setDefaultTimeout(15000);const errors=[];page.on('pageerror',e=>errors.push(e.message))
 await page.goto(base+'/inicio');await page.evaluate(()=>navigator.serviceWorker.ready)
 await page.reload();await page.waitForFunction(()=>navigator.serviceWorker.controller!==null)
 const cdp=await context.newCDPSession(page);const manifest=await cdp.send('Page.getAppManifest');assert.equal(manifest.errors.length,0)
 console.log('PASS: installed service worker and valid manifest')
 await page.goto(base+'/notas');await page.getByLabel('Título',{exact:true}).fill('Caja nocturna');await page.getByLabel('Nota',{exact:true}).fill('Vigilar antes de reponer.');await page.getByRole('button',{name:'Crear nota',exact:true}).click();await page.locator('.note-card').filter({hasText:'Caja nocturna'}).waitFor()
 await page.getByLabel('Título',{exact:true}).fill('Borrador persistente');await page.reload();await page.waitForTimeout(100)
 assert.equal(await page.getByLabel('Título',{exact:true}).inputValue(),'Borrador persistente')
 await page.getByRole('button',{name:'Descartar borrador'}).click()
 await page.getByLabel('Buscar notas').fill('no coincide');assert.equal(await page.locator('.note-card').count(),0);await page.getByLabel('Buscar notas').fill('')
 console.log('PASS: guest CRUD, search and persistent draft')
 await context.setOffline(true)
 for(const route of ['/inicio','/personajes','/mecanicas','/notas','/cuenta']){
  const response=await page.goto(base+route);assert.equal(response.status(),200)
  if(route==='/personajes'){
   for(let i=0;i<6;i++){await page.locator('.cast-item').nth(i).click();for(let d=0;d<4;d++){await page.locator('.direction-picker button').nth(d).click();await page.locator('.hero-sprite').evaluate(img=>img.decode())}}
  }
  if(route==='/mecanicas')for(const card of await page.locator('.mechanic-card').all()){await card.scrollIntoViewIfNeeded();await card.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())))}
 }
 await page.getByRole('button',{name:'Activar y probar notificación'}).click();await page.getByText('Notificación enviada al dispositivo.',{exact:true}).waitFor()
 assert.ok(await page.evaluate(async()=>(await(await navigator.serviceWorker.ready).getNotifications()).length)>0)
 console.log('PASS: offline routes, all 24 sprite views, mechanics images and real local notification')
 await context.setOffline(false);await page.goto(base+'/cuenta');await page.getByLabel('Correo electrónico').fill(credentials.email);await page.getByLabel(/^Contraseña/).fill(credentials.password);await page.getByRole('button',{name:'Entrar',exact:true}).click();await page.getByRole('button',{name:'Cerrar sesión',exact:true}).waitFor()
 await page.getByLabel('Nombre público de jugador').fill('Encargado de prueba');await page.getByRole('button',{name:'Guardar perfil'}).click();await page.getByText('Nombre de jugador actualizado.',{exact:true}).waitFor()
 await page.goto(base+'/notas');await page.getByRole('button',{name:'Importar mis notas de invitado'}).click();await page.getByText('Tus notas están sincronizadas.',{exact:true}).waitFor()
 let card=page.locator('.note-card').filter({hasText:'Caja nocturna'});await card.waitFor();await card.getByRole('button',{name:'Editar',exact:true}).click();await page.getByLabel('Título',{exact:true}).fill('Caja revisada');await page.getByRole('button',{name:'Guardar cambios',exact:true}).click();await page.getByText('Tus notas están sincronizadas.',{exact:true}).waitFor()
 console.log('checking authenticated offline edit');await context.setOffline(true);await page.locator('.note-card').filter({hasText:'Caja revisada'}).getByRole('button',{name:'Editar',exact:true}).click();await page.getByLabel('Nota',{exact:true}).fill('Cambio hecho sin internet');await page.getByRole('button',{name:'Guardar cambios',exact:true}).click();await page.getByText('Pendiente de sincronizar',{exact:false}).first().waitFor()
 await context.setOffline(false);await page.getByText('Tus notas están sincronizadas.',{exact:true}).waitFor()
 console.log('PASS: real sign-in, profile update, guest import and offline-to-online synchronization')
 await page.screenshot({path:'../pwa-bitacora.png',fullPage:true})
 await page.locator('.note-card').filter({hasText:'Caja revisada'}).getByRole('button',{name:'Eliminar',exact:true}).click();await page.getByRole('button',{name:'Sí, eliminar',exact:true}).click();await page.getByText('Tus notas están sincronizadas.',{exact:true}).waitFor();assert.equal(await page.locator('.note-card').count(),0)
 await page.goto(base+'/cuenta');await page.getByRole('button',{name:'Cerrar sesión',exact:true}).click();await page.getByRole('button',{name:'Entrar',exact:true}).waitFor();await page.goto(base+'/notas');assert.equal(await page.locator('.note-card').count(),0)
 for(const width of [320,390,1440]){await page.setViewportSize({width,height:900});for(const route of ['/inicio','/personajes','/mecanicas','/notas','/cuenta','/marcador']){await page.goto(base+route);await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${route} overflow at ${width}`)}}
 assert.deepEqual(errors,[])
 console.log('PASS: delete synchronization, account separation, all layouts at 320/390/1440px, no JavaScript errors')
 await browser.close()
})().catch(async e=>{console.error(e);if(debugPage){console.log((await debugPage.locator('body').innerText()).slice(0,3500));await debugPage.screenshot({path:'../../work/pwa-failure.png',fullPage:true});}process.exit(1)})



