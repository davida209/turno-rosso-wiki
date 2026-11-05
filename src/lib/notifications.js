export async function swReady() {
 if (!('serviceWorker' in navigator)) throw new Error('Tu navegador no admite esta función.')
 const registration=await navigator.serviceWorker.getRegistration()
 if(!registration)throw new Error('Abre la versión publicada y espera a que termine la descarga para activar esta función.')
 return navigator.serviceWorker.ready
}
export async function showLocalNotification(title, body, url='/notas') {
 if (!('Notification' in window)) throw new Error('Este navegador no admite notificaciones. En iPhone instala la app y ábrela desde su icono.')
 if (Notification.permission !== 'granted') throw new Error('Activa primero el permiso de notificaciones.')
 const registration=await swReady()
 await registration.showNotification(title,{body,icon:'/icons/icon-192.png',badge:'/icons/badge.png',tag:'rosso-local',data:{url}})
}
export async function requestNotifications() {
 if (!('Notification' in window)) throw new Error('En este dispositivo, instala la app y ábrela desde su icono para activar notificaciones.')
 const result=await Notification.requestPermission()
 if(result!=='granted') throw new Error('El permiso no está activado. Puedes cambiarlo en los ajustes del navegador.')
 return result
}
export async function pushRequest(session,action,extra={}) {
 const response=await fetch('/api/push',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({action,...extra})})
 const data=await response.json()
 if(!response.ok)throw new Error(data.error || 'No se pudo actualizar la suscripción.')
 return data
}
export async function subscribePush(session) {
 const response=await fetch('/api/push');const data=await response.json()
 if(!response.ok || !data.publicKey)throw new Error('Las notificaciones push no están disponibles ahora.')
 await requestNotifications()
 const registration=await swReady()
 if(!registration.pushManager)throw new Error('Este navegador no admite avisos push.')
 let subscription=await registration.pushManager.getSubscription()
 if(!subscription){
  const padding='='.repeat((4-data.publicKey.length%4)%4)
  const raw=atob((data.publicKey+padding).replace(/-/g,'+').replace(/_/g,'/'))
  const key=Uint8Array.from(raw,c=>c.charCodeAt(0))
  subscription=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key})
 }
 await pushRequest(session,'subscribe',{subscription:subscription.toJSON()})
 return subscription
}
