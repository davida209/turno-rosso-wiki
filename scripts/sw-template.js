const CACHE='turnorosso-pwa-__REVISION__'
const PRECACHE=__PRECACHE__
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PRECACHE))))
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('turnorosso-pwa-')&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()))
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting()})
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url)
 if(event.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return
 if(event.request.mode==='navigate'){
  event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match('/index.html'))||fetch(event.request)))
 }else if(PRECACHE.includes(url.pathname)){
  event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(url.pathname))||fetch(event.request)))
 }
})
self.addEventListener('push',event=>{
 let payload={};try{payload=event.data?.json()||{}}catch{}
 const url=typeof payload.url==='string'&&payload.url.startsWith('/')&&!payload.url.startsWith('//')?payload.url:'/notas'
 event.waitUntil(self.registration.showNotification(String(payload.title||'Turno Rosso').slice(0,100),{body:String(payload.body||'Tu guía del encargado te espera.').slice(0,300),icon:'/icons/icon-192.png',badge:'/icons/badge.png',tag:'rosso-push',data:{url}}))
})
self.addEventListener('notificationclick',event=>{
 event.notification.close()
 const raw=event.notification.data?.url||'/notas'
 const target=new URL(raw,self.location.origin)
 if(target.origin!==self.location.origin)return
 event.waitUntil((async()=>{const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});for(const client of windows){if(new URL(client.url).origin===self.location.origin){await client.navigate(target.href);return client.focus()}}return self.clients.openWindow(target.href)})())
})
