export async function swReady() {
 if (!('serviceWorker' in navigator)) throw new Error('Tu navegador no admite esta función.')
 const registration=await navigator.serviceWorker.getRegistration()
 if(!registration)throw new Error('Abre la versión publicada y espera a que termine la descarga para activar esta función.')
 return navigator.serviceWorker.ready
}
export async function showLocalNotification(title, body, url='/simulador') {
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
