import { createBrowserClient } from '@supabase/ssr'

/**
 * Cliente Supabase para uso em Client Components (browser-side).
 * Instanciado uma vez por chamada para evitar múltiplas conexões.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
