import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { adminClient } from '../server/push.js'

const fields = 'id,area,section,title,description,status,updated_at'
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const cookieName = '__Host-rosso_reports'
const hash = value => createHash('sha256').update(value).digest()

function response(value, status = 200, headers = {}) {
  return Response.json(value, { status, headers: { 'Cache-Control': 'private, no-store', ...headers } })
}

async function handle(request) {
  const url = new URL(request.url)
  const method = request.method
  const admin = url.searchParams.get('admin') === '1'
  if (method !== 'GET' && request.headers.get('origin') !== url.origin) {
    return response({ error: 'Origen no permitido.' }, 403)
  }

  const headers = {}
  const table = adminClient().from('wiki_reports')
  let scoped
  let browserKey
  if (admin) {
    const secret = process.env.REPORT_ADMIN_KEY
    const authorization = request.headers.get('authorization') ?? ''
    if (!secret || !timingSafeEqual(hash(authorization), hash('Bearer ' + secret))) {
      return response({ error: 'Clave de revisión incorrecta.' }, 401)
    }
    if (!['GET', 'PATCH'].includes(method)) return response({ error: 'Operación no disponible.' }, 405)
    scoped = query => query
  } else {
    const cookies = (request.headers.get('cookie') ?? '').split(';').map(value => value.trim())
    let token = cookies.find(value => value.startsWith(cookieName + '='))?.slice(cookieName.length + 1)
    if (!/^[a-f0-9]{64}$/.test(token ?? '')) {
      if (method !== 'GET') return response({ error: 'Vuelve a cargar tus reportes antes de continuar.' }, 409)
      token = randomBytes(32).toString('hex')
      headers['Set-Cookie'] = cookieName + '=' + token + '; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=31536000'
    }
    browserKey = hash(token).toString('hex')
    scoped = query => query.eq('browser_key', browserKey)
  }

  if (method === 'GET') {
    const { data, error } = await scoped(table.select(fields)).order('updated_at', { ascending: false })
    if (error) throw error
    return response(data, 200, headers)
  }
  const id = url.searchParams.get('id') ?? ''
  if (method !== 'POST' && !uuid.test(id)) return response({ error: 'Identificador inválido.' }, 400)
  if (method === 'DELETE') {
    const { error } = await scoped(table.delete()).eq('id', id)
    if (error) throw error
    return response({ ok: true })
  }

  const raw = await request.text()
  if (raw.length > 8192) return response({ error: 'El reporte es demasiado largo.' }, 413)
  let input
  try { input = JSON.parse(raw) } catch { return response({ error: 'Reporte inválido.' }, 400) }

  const updated_at = new Date().toISOString()
  let changes
  if (admin) {
    if (!['nuevo', 'revision', 'resuelto'].includes(input?.status)) return response({ error: 'Estado inválido.' }, 400)
    changes = { status: input.status, updated_at }
  } else {
    const title = typeof input?.title === 'string' ? input.title.trim() : ''
    const description = typeof input?.description === 'string' ? input.description.trim() : ''
    const section = typeof input?.section === 'string' ? input.section.trim() : ''
    if (!title || title.length > 100 || !description || description.length > 3000 ||
        !section || section.length > 80 || !['guia', 'juego'].includes(input?.area)) {
      return response({ error: 'Completa el título, la sección y la descripción.' }, 400)
    }
    changes = { area: input.area, section, title, description, updated_at }
    if (method === 'PATCH') changes.status = 'nuevo'
  }
  if (method === 'POST' && !uuid.test(input.id ?? '')) return response({ error: 'Identificador inválido.' }, 400)
  const query = method === 'POST'
    ? table.upsert({ ...changes, id: input.id, browser_key: browserKey }, { onConflict: 'browser_key,id', ignoreDuplicates: true })
    : scoped(table.update(changes)).eq('id', id)
  const { data, error } = await query.select(fields).maybeSingle()
  if (error) throw error
  if (data) return response(data, method === 'POST' ? 201 : 200)
  if (method === 'PATCH') return response({ error: 'El reporte ya no está disponible.' }, 404)
  const existing = await scoped(table.select(fields)).eq('id', input.id).single()
  if (existing.error) throw existing.error
  return response(existing.data)
}

async function run(request) {
  try {
    return await handle(request)
  } catch (error) {
    console.error('wiki_reports_failed', { code: error.code ?? 'unknown' })
    return response({ error: 'No se pudieron procesar los reportes. Intenta de nuevo.' }, 503)
  }
}

export const GET = run
export const POST = run
export const PATCH = run
export const DELETE = run
