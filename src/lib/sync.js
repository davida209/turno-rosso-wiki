import { supabase } from './cloud.js'
import { getNotes, saveNotes } from './local.js'
const jobs = new Map()
export function syncNotes(owner) {
  if (!owner || !supabase || !navigator.onLine) return Promise.resolve()
  if (jobs.has(owner)) return jobs.get(owner)
  const job = run(owner).finally(() => jobs.delete(owner))
  jobs.set(owner, job)
  return job
}
async function run(owner) {
  for (let pass=0;pass<5;pass++) {
  const snapshot = getNotes(owner).filter(n => n.dirty)
  if (!snapshot.length) break
  for (const note of snapshot) {
    let response
    if (note.deleted) response = await supabase.from('notes').delete().eq('id',note.id).eq('user_id',owner)
    else {
      const row = { id:note.id, user_id:owner, title:note.title, body:note.body, category:note.category, updated_at:note.updated_at }
      if (note.remote) response = await supabase.from('notes').update(row).eq('id',note.id).eq('user_id',owner)
      else {
        response = await supabase.from('notes').insert(row)
        if (response.error?.code === '23505') response = await supabase.from('notes').update(row).eq('id',note.id).eq('user_id',owner)
      }
    }
    if (response.error) throw response.error
    const latest = getNotes(owner)
    saveNotes(owner, latest.flatMap(n => n.id !== note.id || n.revision !== note.revision ? [n] : note.deleted ? [] : [{...n,dirty:false,remote:true}]))
  }
  }
  const {data,error} = await supabase.from('notes').select('*').eq('user_id',owner).order('updated_at',{ascending:false})
  if (error) throw error
  const dirty = getNotes(owner).filter(n => n.dirty)
  const ids = new Set(dirty.map(n=>n.id))
  saveNotes(owner,[...dirty,...data.filter(n=>!ids.has(n.id)).map(n=>({...n,remote:true,dirty:false,deleted:false}))])
}
