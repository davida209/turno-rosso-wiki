import pg from 'pg'
import { readFile } from 'node:fs/promises'
process.loadEnvFile('.env.local')
const url=new URL(process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL)
url.searchParams.delete('sslmode')
const db=new pg.Client({connectionString:url.toString(),ssl:{rejectUnauthorized:false}})
try { await db.connect(); await db.query(await readFile('supabase/001_pwa.sql','utf8')); console.log('PWA schema applied successfully'); } finally { await db.end() }
