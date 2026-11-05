export function readLocal(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
export function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new Event('rosso:storage'))
}
export const noteKey = owner => `rosso:notes:v1:${owner || 'guest'}`
export function getNotes(owner) { const value = readLocal(noteKey(owner), []); return Array.isArray(value) ? value.filter(n => n && typeof n.id === 'string' && typeof n.title === 'string' && typeof n.body === 'string' && typeof n.updated_at === 'string') : [] }
export function saveNotes(owner, notes) { writeLocal(noteKey(owner), notes) }
export function makeNote(fields) { return { ...fields, id: crypto.randomUUID(), updated_at: new Date().toISOString(), revision: crypto.randomUUID(), dirty: true, remote: false, deleted: false } }
export function filterNotes(notes, query = '', category = 'all') {
  const q = query.toLocaleLowerCase('es')
  return notes.filter(n => !n.deleted && (category === 'all' || n.category === category) && `${n.title} ${n.body}`.toLocaleLowerCase('es').includes(q)).sort((a,b) => b.updated_at.localeCompare(a.updated_at))
}
