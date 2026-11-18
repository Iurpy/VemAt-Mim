'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { criarClienteNavegador } from '@/lib/supabase/client'
import ControlesAcessibilidade from './ControlesAcessibilidade'

export default function Cabecalho() {
  const router = useRouter()
  const [logado, setLogado] = useState(null) // null = ainda verificando

  useEffect(() => {
    const supabase = criarClienteNavegador()
    supabase.auth.getUser().then(({ data: { user } }) => setLogado(!!user))
    const { data } = supabase.auth.onAuthStateChange((_evento, sessao) => setLogado(!!sessao))
    return () => data.subscription.unsubscribe()
  }, [])

  async function sair() {
    const supabase = criarClienteNavegador()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="cabecalho">
      <div className="largura topo">
        <Link href="/" className="logo" aria-label="Vem Até Mim, página inicial">
          <svg width="36" height="36" viewBox="0 0 34 34" aria-hidden="true">
            <path d="M4 16 17 5l13 11v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" fill="var(--verde)" />
            <path d="M11 30v-8a6 6 0 0 1 12 0v8" fill="var(--sol)" />
          </svg>
          Vem Até Mim
        </Link>

        <nav aria-label="Principal">
          <ul>
            {logado === true && (
              <>
                <li><Link href="/conta">Minha conta</Link></li>
                <li><button type="button" className="link" onClick={sair}>Sair</button></li>
              </>
            )}
            {logado === false && (
              <>
                <li><Link href="/entrar">Entrar</Link></li>
                <li><Link href="/cadastro" className="botao pequeno">Criar conta</Link></li>
              </>
            )}
          </ul>
        </nav>

        <ControlesAcessibilidade />
      </div>
    </header>
  )
}
