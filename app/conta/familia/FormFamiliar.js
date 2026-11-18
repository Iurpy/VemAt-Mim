'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { criarClienteNavegador } from '@/lib/supabase/client'
import {
  enderecoParaBanco, enderecoParaTela, enderecoVazio,
  formatarTelefone, soDigitos, telefoneValido, validarEndereco,
} from '@/lib/formatos'
import { traduzirErro } from '@/lib/erros'
import Campo from '@/components/Campo'
import CamposEndereco from '@/components/CamposEndereco'
import ResumoErros from '@/components/ResumoErros'

const PARENTESCOS = ['Mãe', 'Pai', 'Avó', 'Avô', 'Tia', 'Tio', 'Sogra', 'Sogro', 'Irmã', 'Irmão', 'Esposa', 'Marido']

// Formulário usado para CADASTRAR (sem id) e EDITAR (com id) um familiar
export default function FormFamiliar({ id }) {
  const router = useRouter()
  const editando = !!id
  const [carregando, setCarregando] = useState(editando)
  const [naoEncontrado, setNaoEncontrado] = useState(false)
  const [dados, setDados] = useState({ nome: '', parentesco: '', telefone: '', concorda: false })
  const [endereco, setEndereco] = useState(enderecoVazio)
  const [erros, setErros] = useState({})
  const [mensagem, setMensagem] = useState('')
  const [salvando, setSalvando] = useState(false)

  // READ (só na edição): carrega os dados atuais
  useEffect(() => {
    if (!editando) return
    async function carregar() {
      const supabase = criarClienteNavegador()
      const { data, error } = await supabase.from('familiares').select('*').eq('id', id).maybeSingle()
      if (error) setMensagem(traduzirErro(error))
      else if (!data) setNaoEncontrado(true)
      else {
        setDados({
          nome: data.nome,
          parentesco: data.parentesco || '',
          telefone: formatarTelefone(data.telefone || ''),
          concorda: true,
        })
        setEndereco(enderecoParaTela(data))
      }
      setCarregando(false)
    }
    carregar()
  }, [editando, id])

  const alterar = (campo, valor) => setDados((atual) => ({ ...atual, [campo]: valor }))
  const alterarEndereco = (campo, valor) => setEndereco((atual) => ({ ...atual, [campo]: valor }))

  function validar() {
    const e = {}
    if (dados.nome.trim().length < 2) e.nome = 'Digite o nome da pessoa.'
    if (dados.telefone && !telefoneValido(dados.telefone)) e.telefone = 'Digite o telefone com DDD ou deixe em branco.'
    Object.assign(e, validarEndereco(endereco))
    if (!editando && !dados.concorda) e.concorda = 'Marque a confirmação de que a pessoa sabe e concorda com o cadastro.'
    return e
  }

  // CREATE ou UPDATE
  async function salvar(evento) {
    evento.preventDefault()
    setMensagem('')
    const e = validar()
    setErros(e)
    if (Object.keys(e).length) return

    const registro = {
      nome: dados.nome.trim(),
      parentesco: dados.parentesco.trim() || null,
      telefone: soDigitos(dados.telefone) || null,
      ...enderecoParaBanco(endereco),
    }

    setSalvando(true)
    const supabase = criarClienteNavegador()
    const { error } = editando
      ? await supabase.from('familiares').update(registro).eq('id', id)
      : await supabase.from('familiares').insert({ ...registro, concorda_com_cadastro: true })
    setSalvando(false)

    if (error) {
      setMensagem(traduzirErro(error))
      return
    }
    router.push(`/conta/familia?aviso=${editando ? 'salvo' : 'criado'}`)
    router.refresh()
  }

  if (carregando) return <p className="carregando" role="status">Carregando...</p>

  if (naoEncontrado) {
    return (
      <div>
        <h1>Familiar não encontrado</h1>
        <p>Esse cadastro não existe ou não é da sua família.</p>
        <Link href="/conta/familia" className="botao">Voltar para minha família</Link>
      </div>
    )
  }

  return (
    <div className="formulario">
      <h1>{editando ? `Editar ${dados.nome}` : 'Cadastrar familiar'}</h1>

      <ResumoErros erros={erros} mensagem={mensagem} />

      <form onSubmit={salvar} noValidate>
        <fieldset className="grupo">
          <legend>Quem é</legend>
          <Campo id="nome" rotulo="Nome da pessoa" value={dados.nome} onChange={(e) => alterar('nome', e.target.value)} erro={erros.nome} />
          <Campo
            id="parentesco" rotulo="Parentesco" opcional list="lista-parentescos"
            ajuda="Escolha da lista ou escreva, por exemplo: avó, tio, madrinha."
            value={dados.parentesco} onChange={(e) => alterar('parentesco', e.target.value)}
          />
          <datalist id="lista-parentescos">
            {PARENTESCOS.map((p) => <option key={p} value={p} />)}
          </datalist>
          <Campo
            id="telefone" rotulo="Telefone da pessoa" opcional type="tel" inputMode="tel"
            ajuda="Para a profissional avisar quando estiver chegando."
            value={dados.telefone} onChange={(e) => alterar('telefone', formatarTelefone(e.target.value))} erro={erros.telefone}
          />
        </fieldset>

        <CamposEndereco titulo="Onde a pessoa mora" valores={endereco} alterar={alterarEndereco} erros={erros} />

        {!editando && (
          <div className={`campo${erros.concorda ? ' com-erro' : ''}`}>
            <label className="opcao destaque" htmlFor="concorda">
              <input
                id="concorda" type="checkbox" checked={dados.concorda}
                onChange={(e) => alterar('concorda', e.target.checked)}
                aria-invalid={erros.concorda ? true : undefined}
                aria-describedby={erros.concorda ? 'concorda-erro' : undefined}
              />
              <span>Essa pessoa sabe e concorda que eu cadastre os dados dela para agendar atendimentos.</span>
            </label>
            {erros.concorda && <p id="concorda-erro" className="erro-campo">{erros.concorda}</p>}
          </div>
        )}

        <div className="acoes">
          <button type="submit" className="botao" disabled={salvando}>
            {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar familiar'}
          </button>
          <Link href="/conta/familia" className="botao secundario">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}
