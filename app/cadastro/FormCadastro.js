'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, Check, HeartHandshake } from 'lucide-react'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { emailValido, formatarTelefone, soDigitos, telefoneValido } from '@/lib/formatos'
import { traduzirErro } from '@/lib/erros'
import Campo from '@/components/Campo'
import CampoSenha from '@/components/CampoSenha'
import ResumoErros from '@/components/ResumoErros'
import TopoAzul from '@/components/TopoAzul'
import Logo from '@/components/Logo'
import BotaoLeitura from '@/components/BotaoLeitura'

const TIPOS = {
  cliente: {
    Icone: HeartHandshake,
    titulo: 'Quero contratar',
    descricao: 'Atendimento em casa para mim ou para alguém da família',
  },
  profissional: {
    Icone: Briefcase,
    titulo: 'Sou profissional',
    descricao: 'Quero oferecer meus serviços',
  },
}

export default function FormCadastro({ tipoInicial }) {
  const router = useRouter()
  const [passo, setPasso] = useState(tipoInicial ? 2 : 1)
  const [tipo, setTipo] = useState(tipoInicial || 'cliente')
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
      setEmailEnviado(true) // o Supabase está exigindo confirmação por e-mail
    }
  }

  const topo = (titulo, subtitulo) => (
    <TopoAzul>
      <div className="topo-linha">
        <Logo />
        <BotaoLeitura />
      </div>
      <h1>{titulo}</h1>
      <p>{subtitulo}</p>
    </TopoAzul>
  )

  if (emailEnviado) {
    return (
      <div className="tela-dividida">
        {topo('Falta só confirmar', 'Abra o seu e-mail para ativar a conta.')}
        <div className="folha">
          <div className="aviso sucesso" role="status">
            <p>Enviamos um link para <strong>{dados.email}</strong>. Toque nele para ativar a conta.</p>
            <p>Não chegou? Veja também a pasta de spam ou lixo eletrônico.</p>
          </div>
        </div>
      </div>
    )
  }

  // Passo 1: escolher como vai usar o site
  if (passo === 1) {
    return (
      <div className="tela-dividida">
        {topo('Crie sua conta', 'Cuidado pessoal que chega até a sua porta, com segurança.')}
        <div className="folha">
          <fieldset className="opcoes-conta">
            <legend>Como você vai usar o site?</legend>
            {Object.entries(TIPOS).map(([valor, t]) => (
              <label key={valor} className="opcao-conta">
                <input
                  type="radio"
                  name="tipo"
                  value={valor}
                  checked={tipo === valor}
                  onChange={() => setTipo(valor)}
                  className="so-leitor"
                />
                <span className="opcao-icone" aria-hidden="true"><t.Icone size={24} /></span>
                <span className="opcao-texto">
                  <strong>{t.titulo}</strong>
                  <span>{t.descricao}</span>
                </span>
                <span className="opcao-marca" aria-hidden="true"><Check size={18} strokeWidth={3} /></span>
              </label>
            ))}
          </fieldset>

          <button type="button" className="botao largo" onClick={() => setPasso(2)}>
            Continuar
          </button>

          <p className="rodape-folha">
            Já tem conta? <Link href="/entrar">Entrar</Link>
          </p>
        </div>
      </div>
    )
  }

  // Passo 2: dados da conta
  return (
    <div className="tela-dividida">
      {topo('Seus dados', tipo === 'profissional' ? 'Conta de profissional' : 'Conta para contratar serviços')}
      <div className="folha">
        <p className="escolhido">
          {TIPOS[tipo].titulo}.{' '}
          <button type="button" className="link" onClick={() => setPasso(1)}>Trocar</button>
        </p>

        <ResumoErros erros={erros} mensagem={mensagem} />

        <form onSubmit={enviar} noValidate>
          <Campo id="nome" rotulo="Seu nome" autoComplete="name" value={dados.nome}
            onChange={(e) => alterar('nome', e.target.value)} erro={erros.nome} />
          <Campo id="telefone" rotulo="Telefone com DDD" type="tel" inputMode="tel" autoComplete="tel"
            ajuda="De preferência com WhatsApp." value={dados.telefone}
            onChange={(e) => alterar('telefone', formatarTelefone(e.target.value))} erro={erros.telefone} />
          <Campo id="email" rotulo="E-mail" type="email" autoComplete="email" value={dados.email}
            onChange={(e) => alterar('email', e.target.value)} erro={erros.email} />
          <CampoSenha id="senha" rotulo="Crie uma senha" ajuda="Pelo menos 6 letras ou números."
            autoComplete="new-password" value={dados.senha}
            onChange={(e) => alterar('senha', e.target.value)} erro={erros.senha} />

          <button type="submit" className="botao largo" disabled={enviando}>
            {enviando ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="rodape-folha">
          Já tem conta? <Link href="/entrar">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
