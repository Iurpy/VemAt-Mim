import { createBrowserClient } from '@supabase/ssr'

// Cliente do Supabase usado nas telas (componentes com 'use client')
export function criarClienteNavegador() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
