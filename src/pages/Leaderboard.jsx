import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase, messageFor } from '../lib/cloud.js'
import { readLocal, writeLocal } from '../lib/local.js'
import './Leaderboard.css'
export default function Leaderboard(){
 const {user}=useAuth();const [tab,setTab]=useState('global');const [query,setQuery]=useState('');const [sort,setSort]=useState('best_score');const [result,setResult]=useState('all')
 const [rows,setRows]=useState([]);const [busy,setBusy]=useState(true);const [error,setError]=useState('');const [cached,setCached]=useState(false);const [refresh,setRefresh]=useState(0)
 useEffect(()=>{
  let alive=true;const controller=new AbortController();const key=tab==='global'?'rosso:ranking:v1':`rosso:runs:v1:${user?.id||'guest'}`
  setBusy(true);setError('');setCached(false)
  async function load(){
   const previous=readLocal(key,null)
   if(previous){setRows(previous.rows);setCached(true)}else setRows([])
   if(tab==='mine'&&!user){setBusy(false);return}
   if(!navigator.onLine){setError(previous?`Copia guardada el ${new Date(previous.saved).toLocaleString('es-MX')}.`:'Necesitas conexión para consultar los resultados por primera vez.');setBusy(false);return}
   try{
    if(!supabase)throw new Error('API unavailable')
    let request
    if(tab==='global'){
     request=supabase.from('leaderboard').select('*').order(sort,{ascending:false}).order('player_id').limit(100)
     const term=query.trim().replace(/[\\%_]/g,'').slice(0,40)
     if(term)request=request.ilike('display_name',`%${term}%`)
    }else{
     request=supabase.from('game_runs').select('id,score,result,verification,played_at,game_version').eq('user_id',user.id).order('played_at',{ascending:false}).limit(100)
     if(result!=='all')request=request.eq('result',result)
    }
    const {data,error}=await request.abortSignal(controller.signal);if(error)throw error
    if(!alive)return;setRows(data);setCached(false)
    // Save only full unfiltered lists, never replace a snapshot with filtered data.
    if(!query&&result==='all')try{writeLocal(key,{rows:data,saved:new Date().toISOString()})}catch{}
   }catch(e){if(alive)setError(messageFor(e))}finally{if(alive)setBusy(false)}
  }
  const timer=setTimeout(load,250)
  return()=>{alive=false;controller.abort();clearTimeout(timer)}
 },[tab,user?.id,query,sort,result,refresh])
 const displayed=cached?rows.filter(r=>tab==='global'?r.display_name.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es')):result==='all'||r.result===result).sort((a,b)=>tab==='global'?b[sort]-a[sort]:0):rows
 const best=Math.max(0,...displayed.map(r=>Number(r.best_score??r.score)))
 return <div className="page"><header className="page-header"><p className="eyebrow">Resultados de Turno Rosso</p><h1>Marcador</h1><p className="page-subtitle">Los puntos se reciben del juego. No se editan desde la web.</p></header><div className="page-content stack"><div className="segmented"><button aria-pressed={tab==='global'} onClick={()=>{setTab('global');setResult('all')}}>Ranking global</button><button aria-pressed={tab==='mine'} onClick={()=>{setTab('mine');setQuery('')}}>Mis partidas</button></div>
 <p className="info-strip">{tab==='global'?'Solo participan partidas verificadas por el servidor. La integración con Unity se realizará por separado.':'Las partidas offline se identificarán como locales y no sumarán al ranking global.'}</p>
 {tab==='global'?<><label>Buscar jugador<input type="search" maxLength={40} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Nombre del encargado"/></label><label>Ordenar por<select value={sort} onChange={e=>setSort(e.target.value)}><option value="best_score">Mejor puntuación</option><option value="wins">Victorias</option><option value="played">Partidas verificadas</option></select></label></>:user&&<label>Resultado<select value={result} onChange={e=>setResult(e.target.value)}><option value="all">Todos</option><option value="won">Victoria</option><option value="lost">Derrota</option></select></label>}
 <div className="stats-grid"><div><strong>{displayed.length}</strong><span>{tab==='global'?'Jugadores mostrados':'Partidas mostradas'}</span></div><div><strong>{best.toLocaleString('es-MX')}</strong><span>Mejor puntuación</span></div></div>
 {error&&<p className="feedback" role="status">{error}</p>}{cached&&<span className="mini-label">Copia local · puede estar desactualizada</span>}
 <button className="secondary-button" disabled={busy||!navigator.onLine} onClick={()=>setRefresh(n=>n+1)}>Actualizar resultados</button>
 {busy?<p role="status">Consultando resultados…</p>:tab==='mine'&&!user?<p className="empty-state">Entra en Mi cuenta para consultar tus partidas. Los resultados de invitado del juego permanecerán en el dispositivo donde juegues hasta que se implemente su importación.</p>:!displayed.length?<p className="empty-state">{tab==='global'?'Todavía no hay jugadores con resultados verificados que coincidan. Cuando se conecte Unity, aparecerán aquí.':'No hay partidas registradas con este filtro.'}</p>:displayed.map((row,i)=><article className="panel score-card" key={row.player_id||row.id}><div className="score-row"><span className="tag-chip">{i+1}</span><h2 className="score-name">{row.display_name||new Date(row.played_at).toLocaleDateString('es-MX')}</h2><strong className="score-amount">{Number(row.best_score??row.score).toLocaleString('es-MX')}</strong></div><p className="muted">{tab==='global'?`${row.wins} victorias · ${row.played} partidas verificadas`: `${row.result==='won'?'Victoria':'Derrota'} · ${{verified:'Verificada',offline:'Offline · no competitiva',pending:'Pendiente de validar',rejected:'No válida para ranking'}[row.verification]}`}</p></article>)}
 <p className="muted">Se muestran hasta 100 resultados por consulta.</p></div></div>
}
