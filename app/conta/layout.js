import { redirect } from 'next/navigation'
import { criarClienteServidor } from '@/lib/supabase/server'
import MenuConta from '@/components/MenuConta'

// Toda página dentro de /conta passa por aqui: sem login, volta para /entrar
export default async function LayoutConta({ children }) {
  const supabase = await criarClienteServidor()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/entrar')

  return (
    <>
      <MenuConta />
      <div className="folha">{children}</div>
    </>
  )
}
