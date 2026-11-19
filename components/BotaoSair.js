'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { criarClienteNavegador } from '@/lib/supabase/client'

export default function BotaoSair() {
  const router = useRouter()
  async function sair() {
    await criarClienteNavegador().auth.signOut()
    router.push('/entrar')
    router.refresh()
  }
  return (
    <button type="button" className="botao secundario largo" onClick={sair}>
      <LogOut size={20} aria-hidden="true" /> Sair da conta
    </button>
  )
}
