import { criarClienteServidor } from '@/lib/supabase/server'
import CabecalhoBranco from '@/components/CabecalhoBranco'

export const metadata = { title: 'Agendar | Vem Até Mim' }

const brl = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Por enquanto mostra os serviços da profissional.
// A escolha de horário e o pagamento entram na próxima etapa.
export default async function PaginaAgendar({ params }) {
  const { id } = await params
  const supabase = await criarClienteServidor()
  const { data: ofertas } = await supabase.from('vitrine').select('*').eq('profissional_id', id)
  const nome = ofertas?.[0]?.profissional

  return (
    <div className="pagina-branca">
      <CabecalhoBranco titulo={nome ? `Agendar com ${nome}` : 'Agendar'} voltar="/buscar" rotuloVoltar="Voltar para a busca" />

      <div className="aviso info">
        <p>A escolha do horário e o pagamento chegam na próxima etapa do projeto.</p>
      </div>

      {ofertas?.length ? (
        <ul className="lista-ofertas">
          {ofertas.map((o) => (
            <li key={o.servico_id} className="item">
              <h2 className="h3">{o.titulo}</h2>
              {o.descricao && <p className="fraco">{o.descricao}</p>}
              <p>{o.duracao_min} minutos, {brl(o.preco_total)} no total</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="vazio"><p>Essa profissional não está disponível no momento.</p></div>
      )}
    </div>
  )
}
