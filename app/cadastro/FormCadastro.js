'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { emailValido, formatarTelefone, soDigitos, telefoneValido } from '@/lib/formatos'
import { traduzirErro } from '@/lib/erros'
import Campo from '@/components/Campo'
import CampoSenha from '@/components/CampoSenha'
import ResumoErros from '@/components/ResumoErros'

const TIPOS = {
  cliente: {
    titulo: 'Quero contratar um serviço',
    descricao: 'Para mim ou para alguém da minha família.',
  },
  profissional: {
    titulo: 'Quero oferecer meus serviços',
    descricao: 'Sou manicure, cabeleireira, barbeiro ou faço outro cuidado pessoal.',
  },
}

export default function FormCadastro({ tipoInicial }) {
  const router = useRouter()
  const [tipo, setTipo] = useState(tipoInicial)
  const [dados, setDados] = useState({ nome: '', telefone: '', email: '', senha: '' })
  const [erros, setErros] = useState({})
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [emailEnviado, setEmailEnviado] = useState(false)

  const alterar = (campo, valor) => setDados((atual) => ({ ...atual, [campo]: valor }))

  function validar() {
    const e = {}
    if (dados.nome.trim().length < 2) e.nome = 'Digite seu nome.'
    if (!telefoneValido(dados.telefone)) e.telefone = 'Digite o telefone com DDD, por exemplo (85) 99999-9999.'
    if (!emailValido(dados.email)) e.email = 'Digite um e-mail válido, por exemplo maria@gmail.com.'
    if (dados.senha.length < 6) e.senha = 'A senha precisa ter pelo menos 6 caracteres.'
    return e
  }

  async function enviar(evento) {
    evento.preventDefault()
    setMensagem('')
    const e = validar()
    setErros(e)
    if (Object.keys(e).length) return

    setEnviando(true)
    const supabase = criarClienteNavegador()
    const { data, error } = await supabase.auth.signUp({
      email: dados.email.trim(),
      password: dados.senha,
      options: {
        // Esses dados viram o perfil automaticamente (gatilho no banco)
        data: { nome: dados.nome.trim(), telefone: soDigitos(dados.telefone), tipo },
        emailRedirectTo: `${window.location.origin}/conta`,
      },
    })
    setEnviando(false)

    if (error) {
      setMensagem(traduzirErro(error))
      return
    }

    if (data.session) {
      router.push('/conta')
      router.refresh()
    } else {
      // O Supabase está exigindo confirmação por e-mail
      setEmailEnviado(true)
    }
  }

  if (emailEnviado) {
    return (
      <div className="formulario">
        <h1>Falta só confirmar o e-mail</h1>
        <div className="aviso sucesso" role="status">
          <p>
            Enviamos um link para <strong>{dados.email}</strong>. Abra seu e-mail e toque no link
            para ativar a conta.
          </p>
          <p>Não chegou? Veja também a pasta de spam ou lixo eletrônico.</p>
        </div>
      </div>
    )
  }

  // Passo 1: escolher o tipo de conta
  if (!tipo) {
    return (
      <div>
        <h1>Criar conta</h1>
        <p>O que você quer fazer no Vem Até Mim?</p>
        <div className="escolhas">
          {Object.entries(TIPOS).map(([valor, t]) => (
            <button key={valor} type="button" className="escolha" onClick={() => setTipo(valor)}>
              <strong>{t.titulo}</strong>
              <span>{t.descricao}</span>
            </button>
          ))}
        </div>
        <p>
          Já tem conta? <Link href="/entrar">Entrar</Link>
        </p>
      </div>
    )
  }

  // Passo 2: dados da conta
  return (
    <div className="formulario">
      <h1>Criar conta</h1>

      <div className="aviso info">
        <p>
          Você escolheu: <strong>{TIPOS[tipo].titulo}</strong>.{' '}
          <button type="button" className="link" onClick={() => setTipo(null)}>
            Trocar
          </button>
        </p>
      </div>

      <ResumoErros erros={erros} mensagem={mensagem} />

      <form onSubmit={enviar} noValidate>
        <Campo
          id="nome"
          rotulo="Seu nome"
          autoComplete="name"
          value={dados.nome}
          onChange={(e) => alterar('nome', e.target.value)}
          erro={erros.nome}
        />
        <Campo
          id="telefone"
          rotulo="Telefone com DDD"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          ajuda="De preferência com WhatsApp."
          value={dados.telefone}
          onChange={(e) => alterar('telefone', formatarTelefone(e.target.value))}
          erro={erros.telefone}
        />
        <Campo
          id="email"
          rotulo="E-mail"
          type="email"
          autoComplete="email"
          value={dados.email}
          onChange={(e) => alterar('email', e.target.value)}
          erro={erros.email}
        />
        <CampoSenha
          id="senha"
          rotulo="Crie uma senha"
          ajuda="Pelo menos 6 letras ou números."
          autoComplete="new-password"
          value={dados.senha}
          onChange={(e) => alterar('senha', e.target.value)}
          erro={erros.senha}
        />

        <div className="acoes">
          <button type="submit" className="botao" disabled={enviando}>
            {enviando ? 'Criando conta...' : 'Criar conta'}
          </button>
        </div>
      </form>

      <p style={{ marginTop: '1.5rem' }}>
        Já tem conta? <Link href="/entrar">Entrar</Link>
      </p>
    </div>
  )
}
