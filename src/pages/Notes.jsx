import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { messageFor } from '../lib/cloud.js'
import { filterNotes, getNotes, makeNote, saveNotes } from '../lib/local.js'
import { syncNotes } from '../lib/sync.js'
const categories={general:'General',inventario:'Inventario',limpieza:'Limpieza',seguridad:'Seguridad',clientes:'Clientes'}
export default function Notes(){
 const {user,loading}=useAuth();const owner=user?.id
 const [notes,setNotes]=useState(()=>getNotes(owner))
 const [query,setQuery]=useState('');const [category,setCategory]=useState('all')
 const [editing,setEditing]=useState(null);const [title,setTitle]=useState('');const [body,setBody]=useState('');const [topic,setTopic]=useState('general')
 const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');const [deleting,setDeleting]=useState(null)
 const [draftFound,setDraftFound]=useState(false)
 const draftKey=`rosso:draft:${owner||'guest'}`
 async function synchronize(){
  if(!owner||!navigator.onLine)return
  setBusy(true)
  try{await syncNotes(owner);setMessage('Tus notas están sincronizadas.')}catch(e){setMessage(messageFor(e))}finally{setBusy(false)}
 }
 useEffect(()=>{
  const refresh=()=>setNotes(getNotes(owner));refresh()
  const restore=()=>{try{const draft=JSON.parse(localStorage.getItem(draftKey));setEditing(draft?.editing??null);setTitle(draft?.title||'');setBody(draft?.body||'');setTopic(draft?.topic||'general');setDraftFound(Boolean(draft?.title||draft?.body))}catch{}}
  restore()
  window.addEventListener('rosso:storage',refresh);window.addEventListener('storage',refresh)
  const online=()=>synchronize();window.addEventListener('online',online)
  if(!loading)synchronize()
  return()=>{window.removeEventListener('rosso:storage',refresh);window.removeEventListener('storage',refresh);window.removeEventListener('online',online)}
 },[owner,loading])
 function draft(values){try{localStorage.setItem(draftKey,JSON.stringify({title,body,topic,editing,...values}))}catch{setMessage('No hay espacio para guardar el borrador.')}}
 function clear(){setEditing(null);setTitle('');setBody('');setTopic('general');setDraftFound(false);localStorage.removeItem(draftKey)}
 function submit(e){
  e.preventDefault();const fields={title:title.trim(),body:body.trim(),category:topic}
  if(!fields.title)return
  try{
   const current=getNotes(owner)
   if(editing){if(!current.some(n=>n.id===editing&&!n.deleted)){setMessage('Esta nota ya no existe. Guarda el contenido como una nota nueva.');setEditing(null);return}saveNotes(owner,current.map(n=>n.id===editing?{...n,...fields,dirty:true,updated_at:new Date().toISOString(),revision:crypto.randomUUID()}:n))}
   else saveNotes(owner,[makeNote(fields),...current])
   clear();setMessage(owner?'Nota guardada en este dispositivo.':'Nota guardada como invitado en este dispositivo.');synchronize()
  }catch{setMessage('No se pudo guardar. Revisa el espacio disponible del dispositivo.')}
 }
 function remove(id){try{saveNotes(owner,getNotes(owner).flatMap(n=>n.id!==id?[n]:[{...n,deleted:true,dirty:true,revision:crypto.randomUUID()}]));setDeleting(null);if(editing===id)clear();setMessage('Nota eliminada.');synchronize()}catch{setMessage('No se pudo eliminar la nota.')}}
 function importGuest(){try{const guest=getNotes(null).filter(n=>!n.deleted);if(!guest.length)return;saveNotes(owner,[...guest.map(n=>makeNote({title:n.title,body:n.body,category:n.category})),...getNotes(owner)]);saveNotes(null,[]);setMessage('Notas de invitado importadas a esta cuenta.');synchronize()}catch{setMessage('No se pudieron importar las notas.')}}
 const visible=filterNotes(notes,query,category);const pending=notes.filter(n=>n.dirty).length
 if(loading)return <div className="page-content" role="status">Cargando tu bitácora…</div>
 return <div className="page"><header className="page-header"><p className="eyebrow">Tu espacio personal</p><h1>Bitácora del encargado</h1><p className="page-subtitle">Estrategias y pendientes para tu próximo turno.</p></header><div className="page-content stack">
  <div className="info-strip">{owner?`${pending} cambios pendientes · Solo tú puedes editar tus notas.`:<>Modo invitado: se guardan aquí. <Link to="/cuenta">Entra para sincronizarlas.</Link></>}</div>
  {owner&&getNotes(null).some(n=>!n.deleted)&&<button className="secondary-button" onClick={importGuest}>Importar mis notas de invitado</button>}
  {message&&<p className="feedback" role="status">{message}</p>}
  <form className="panel stack" onSubmit={submit}><h2>{editing?'Editar nota':'Nueva nota'}</h2>{draftFound&&<p className="muted">Recuperamos tu borrador.</p>}
   <label>Título<input value={title} maxLength={100} required onChange={e=>{setTitle(e.target.value);draft({title:e.target.value})}} placeholder="Ej. Vigilar la caja al reponer"/></label>
   <label>Mecánica<select value={topic} onChange={e=>{setTopic(e.target.value);draft({topic:e.target.value})}}>{Object.entries(categories).map(([key,text])=><option key={key} value={key}>{text}</option>)}</select></label>
   <label>Nota<textarea aria-label="Nota" value={body} maxLength={4000} rows={4} onChange={e=>{setBody(e.target.value);draft({body:e.target.value})}} placeholder="Escribe tu estrategia…"/></label>
   <div className="button-row"><button className="primary-button" type="submit">{editing?'Guardar cambios':'Crear nota'}</button>{(title||body||editing)&&<button className="secondary-button" type="button" onClick={clear}>Descartar borrador</button>}</div>
  </form>
  <div className="stack"><label>Buscar notas<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por título o contenido"/></label><label>Filtrar por mecánica<select value={category} onChange={e=>setCategory(e.target.value)}><option value="all">Todas</option>{Object.entries(categories).map(([key,text])=><option key={key} value={key}>{text}</option>)}</select></label></div>
  <div className="section-heading"><h2>Mis notas ({visible.length})</h2>{owner&&<button className="text-button" disabled={busy||!navigator.onLine} onClick={synchronize}>{busy?'Sincronizando…':'Sincronizar'}</button>}</div>
  {!visible.length&&<p className="empty-state">{notes.some(n=>!n.deleted)?'No hay notas con esos filtros.':'Tu bitácora está lista. Crea tu primera nota.'}</p>}
  {visible.map(note=><article className="panel note-card" key={note.id}><span className="mini-label">{categories[note.category]} · {owner?(note.dirty?'Pendiente de sincronizar':'Sincronizada'):'Local'}</span><h3>{note.title}</h3><p className="note-body">{note.body}</p><time className="muted" dateTime={note.updated_at}>{new Date(note.updated_at).toLocaleDateString('es-MX')}</time><div className="button-row"><button className="secondary-button" onClick={()=>{setEditing(note.id);setTitle(note.title);setBody(note.body);setTopic(note.category);draft({editing:note.id,title:note.title,body:note.body,topic:note.category});window.scrollTo({top:0,behavior:'smooth'})}}>Editar</button><button className="danger-button" onClick={()=>setDeleting(note.id)}>Eliminar</button></div>{deleting===note.id&&<div className="confirm-box" role="group" aria-label="Confirmar eliminación"><p>¿Eliminar esta nota? Se borrará también de tu cuenta al sincronizar.</p><div className="button-row"><button className="danger-button" onClick={()=>remove(note.id)}>Sí, eliminar</button><button className="secondary-button" onClick={()=>setDeleting(null)}>Conservar</button></div></div>}</article>)}
 </div></div>
}
