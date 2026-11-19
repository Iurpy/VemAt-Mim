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
          <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="20" fill="#FFFFFF" />
            <path d="M11 19.5 20 12l9 7.5V29H11z" fill="none" stroke="#0B5FC6" strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M20 26.5s-3.2-2-3.2-4.2a1.7 1.7 0 0 1 3.2-.9 1.7 1.7 0 0 1 3.2.9c0 2.2-3.2 4.2-3.2 4.2z" fill="#0B5FC6" />
          </svg>
          <span>Vem Até <span className="mim">Mim</span></span>
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
