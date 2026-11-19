'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { formatarTelefone, resumoEndereco } from '@/lib/formatos'
import { traduzirErro } from '@/lib/erros'
import { Plus } from 'lucide-react'
import CabecalhoBranco from '@/components/CabecalhoBranco'

const AVISOS = {
  criado: 'Familiar cadastrado.',
  salvo: 'Alterações salvas.',
}

export default function ListaFamilia({ aviso }) {
  const [familiares, setFamiliares] = useState(null) // null = carregando
  const [mensagem, setMensagem] = useState('')
  const [sucesso, setSucesso] = useState(AVISOS[aviso] || '')
  const [confirmando, setConfirmando] = useState(null) // id de quem está para ser excluído

  // READ: lista os familiares de quem está logado (o RLS garante que são só os meus)
  async function carregar() {
    const supabase = criarClienteNavegador()
    const { data, error } = await supabase
      .from('familiares')
      .select('*')
      .order('nome')
    if (error) {
      setMensagem(traduzirErro(error))
      setFamiliares([])
    } else {
      setFamiliares(data)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  // DELETE: exclui depois da confirmação
  async function excluir(familiar) {
    const supabase = criarClienteNavegador()
    const { error } = await supabase.from('familiares').delete().eq('id', familiar.id)
    setConfirmando(null)
    if (error) {
      setMensagem(traduzirErro(error))
      return
    }
    setSucesso(`Cadastro de ${familiar.nome} excluído.`)
    carregar()
  }

  return (
    <div className="pagina-branca">
      <CabecalhoBranco titulo="Minha família" voltar="/conta/perfil" rotuloVoltar="Voltar para o perfil" />
      <p className="fraco">Pessoas para quem você agenda atendimentos. Elas não precisam ter conta no site.</p>

      {sucesso && <div className="aviso sucesso" role="status"><p><strong>{sucesso}</strong></p></div>}
      {mensagem && <div className="aviso erro" role="alert"><p>{mensagem}</p></div>}

      <p><Link href="/conta/familia/nova" className="botao largo"><Plus size={22} aria-hidden="true" /> Cadastrar familiar</Link></p>

      {familiares === null && <p className="carregando" role="status">Carregando sua família...</p>}

      {familiares?.length === 0 && (
        <div className="vazio">
          <p>Você ainda não cadastrou ninguém da sua família.</p>
          <p>Cadastre, por exemplo, sua mãe ou sua avó para agendar atendimentos na casa delas.</p>
        </div>
      )}

      {familiares?.length > 0 && (
        <ul className="lista">
          {familiares.map((f) => (
            <li key={f.id} className="item">
              <h2 className="h3">{f.nome}</h2>
              {f.parentesco && <p className="detalhe">{f.parentesco}</p>}
              <p>{resumoEndereco(f)}</p>
              {f.telefone && <p className="detalhe">Telefone: {formatarTelefone(f.telefone)}</p>}

              {confirmando === f.id ? (
                <div className="confirmar" role="group" aria-label={`Confirmar exclusão de ${f.nome}`}>
                  <p>Excluir {f.nome} da sua família? Isso não pode ser desfeito.</p>
                  <div className="acoes" style={{ marginTop: 0 }}>
                    <button type="button" className="botao perigo" onClick={() => excluir(f)}>
                      Sim, excluir
                    </button>
                    <button type="button" className="botao secundario" onClick={() => setConfirmando(null)} autoFocus>
                      Não, manter
                    </button>
                  </div>
                </div>
              ) : (
                <div className="acoes-item">
                  <Link href={`/conta/familia/${f.id}`} className="botao pequeno secundario">
                    Editar<span className="so-leitor"> {f.nome}</span>
                  </Link>
                  <button type="button" className="botao pequeno perigo-contorno" onClick={() => { setSucesso(''); setConfirmando(f.id) }}>
                    Excluir<span className="so-leitor"> {f.nome}</span>
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
