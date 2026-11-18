'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { emailValido } from '@/lib/formatos'
import { traduzirErro } from '@/lib/erros'
import Campo from '@/components/Campo'
import CampoSenha from '@/components/CampoSenha'
import ResumoErros from '@/components/ResumoErros'

export default function FormEntrar({ destino }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erros, setErros] = useState({})
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(evento) {
    evento.preventDefault()
    setMensagem('')
    const e = {}
    if (!emailValido(email)) e.email = 'Digite o e-mail que você usou no cadastro.'
    if (!senha) e.senha = 'Digite sua senha.'
    setErros(e)
    if (Object.keys(e).length) return

    setEnviando(true)
    const supabase = criarClienteNavegador()
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha })
    setEnviando(false)

    if (error) {
      setMensagem(traduzirErro(error))
      return
    }
    router.push(destino)
    router.refresh()
  }

  return (
    <div className="formulario">
      <h1>Entrar</h1>

      <ResumoErros erros={erros} mensagem={mensagem} />

      <form onSubmit={enviar} noValidate>
        <Campo
          id="email"
          rotulo="E-mail"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          erro={erros.email}
        />
        <CampoSenha
          id="senha"
          rotulo="Senha"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          erro={erros.senha}
        />
        <div className="acoes">
          <button type="submit" className="botao" disabled={enviando}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>

      <p style={{ marginTop: '1.5rem' }}>
        Ainda não tem conta? <Link href="/cadastro">Criar conta</Link>
      </p>
    </div>
  )
}
