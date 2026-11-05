import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
export default function AppStatus(){
 const {user}=useAuth()
 const [online,setOnline]=useState(navigator.onLine)
 const [ready,setReady]=useState(false)
 const [waiting,setWaiting]=useState(null)
 useEffect(()=>{
  const update=()=>setOnline(navigator.onLine)
  window.addEventListener('online',update);window.addEventListener('offline',update)
  let alive=true
  if('serviceWorker' in navigator && import.meta.env.PROD){
   navigator.serviceWorker.register('/sw.js').then(reg=>{
    if(!alive)return
    if(reg.waiting)setWaiting(reg.waiting)
    reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller&&alive)setWaiting(reg.waiting)})})
   }).catch(()=>{})
   navigator.serviceWorker.ready.then(()=>{if(alive)setReady(true)})
  }
  return()=>{alive=false;window.removeEventListener('online',update);window.removeEventListener('offline',update)}
 },[])
 function applyUpdate(){navigator.serviceWorker.addEventListener('controllerchange',()=>window.location.reload(),{once:true});waiting.postMessage('SKIP_WAITING')}
 return <><div className="app-status"><span><i className={online?'connection-dot':'connection-dot offline'}/>{online?(ready?'Lista sin conexión':'En línea'):'Sin conexión · modo local'}</span><Link to="/cuenta">{user?'Mi cuenta':'Invitado / Entrar'} ↗</Link></div>{waiting&&<div className="update-banner" role="status">Hay una versión nueva.<button onClick={applyUpdate}>Actualizar</button></div>}</>
}
