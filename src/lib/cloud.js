import { createClient } from '@supabase/supabase-js'
export const cloudConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
export const supabase = cloudConfigured ? createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null
export function messageFor(error) {
  const code = error?.code
  if (code === 'invalid_credentials') return 'El correo o la contraseña no son correctos.'
  if (code === 'email_not_confirmed') return 'Confirma tu correo antes de entrar.'
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit') return 'Demasiados intentos. Espera unos minutos y vuelve a probar.'
  if (!navigator.onLine || error?.message?.includes('fetch')) return 'No hay conexión con el servidor. Tus cambios locales siguen guardados.'
  return 'No se pudo completar la operación. Revisa los datos e inténtalo de nuevo.'
}
