import { createHash, randomBytes } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { evaluatePlan, scenarios } from '../src/data/scenarios.js'

const fields = 'id,scenario,title,actions,updated_at'
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const cookieName = '__Host-rosso_plans'

function response(value, status = 200, headers = {}) {
  return Response.json(value, { status, headers: { 'Cache-Control': 'private, no-store', ...headers } })
}

function browserToken(request) {
  const cookies = request.headers.get('cookie')?.split(';') ?? []
  const value = cookies.map(cookie => cookie.trim()).find(cookie => cookie.startsWith(cookieName + '='))
  const token = value?.slice(cookieName.length + 1)
  return /^[a-f0-9]{64}$/.test(token ?? '') ? token : null
}

async function handle(request) {
  const url = new URL(request.url)
  const method = request.method
  let token = browserToken(request)
  if (method !== 'GET') {
    if (request.headers.get('origin') !== url.origin) return response({ error: 'Origen no permitido.' }, 403)
    if (!token) return response({ error: 'Abre el simulador para recuperar el almacenamiento de este navegador.' }, 409)
  }

  const headers = {}
  if (!token) {
    token = randomBytes(32).toString('hex')
    headers['Set-Cookie'] = cookieName + '=' + token + '; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=31536000'
  }
  const browserKey = createHash('sha256').update(token).digest('hex')
  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const table = db.from('simulator_plans')
  if (method === 'GET') {
    const { data, error } = await table.select(fields).eq('browser_key', browserKey).order('updated_at', { ascending: false })
    if (error) throw error
    return response(data, 200, headers)
  }

  const id = url.searchParams.get('id') ?? ''
  if (method !== 'POST' && !uuid.test(id)) return response({ error: 'Identificador inválido.' }, 400)
  if (method === 'DELETE') {
    const { error } = await table.delete().eq('browser_key', browserKey).eq('id', id)
    if (error) throw error
    return response({ ok: true })
  }

  const raw = await request.text()
  if (raw.length > 2048) return response({ error: 'El plan es demasiado largo.' }, 413)
  let input
  try { input = JSON.parse(raw) } catch { return response({ error: 'Plan inválido.' }, 400) }
  const title = typeof input?.title === 'string' ? input.title.trim() : ''
  const scenario = scenarios.find(item => item.id === input?.scenario)
  if (!title || title.length > 60 || !evaluatePlan(scenario, input?.actions)) {
    return response({ error: 'Ponle un nombre al plan y elige dos acciones distintas.' }, 400)
  }

  const changes = { title, scenario: scenario.id, actions: input.actions, updated_at: new Date().toISOString() }
  if (method === 'POST' && !uuid.test(input.id ?? '')) return response({ error: 'Identificador inválido.' }, 400)
  const query = method === 'POST'
    ? table.upsert({ ...changes, id: input.id, browser_key: browserKey }, { onConflict: 'browser_key,id', ignoreDuplicates: true })
    : table.update(changes).eq('browser_key', browserKey).eq('id', id)
  const { data, error } = await query.select(fields).maybeSingle()
  if (error) throw error
  if (data) return response(data, method === 'POST' ? 201 : 200)
  if (method === 'PATCH') return response({ error: 'Este plan ya no está guardado.' }, 404)
  const existing = await table.select(fields).eq('browser_key', browserKey).eq('id', input.id).single()
  if (existing.error) throw existing.error
  return response(existing.data)
}

async function run(request) {
  try {
    return await handle(request)
  } catch (error) {
    console.error('simulator_plans_failed', { code: error.code ?? 'unknown' })
    return response({ error: 'No se pudo acceder a los planes. Vuelve a intentarlo.' }, 503)
  }
}

export const GET = run
export const POST = run
export const PATCH = run
export const DELETE = run
