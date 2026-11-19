import Link from 'next/link'
import { criarClienteServidor } from '@/lib/supabase/server'
import CabecalhoBranco from '@/components/CabecalhoBranco'
import CartaoAgendamento from '@/components/CartaoAgendamento'
import { CAMPOS_AGENDAMENTO } from '@/lib/agendamentos'

export const metadata = { title: 'Agenda | Vem Até Mim' }

export default async function PaginaAgenda() {
  const supabase = await criarClienteServidor()
  const { data: { user } } = await supabase.auth.getUser()
  const agora = new Date().toISOString()

  const [{ data: proximos }, { data: anteriores }] = await Promise.all([
    supabase.from('agendamentos').select(CAMPOS_AGENDAMENTO)
      .or(`cliente_id.eq.${user.id},profissional_id.eq.${user.id}`)
      .gte('inicio', agora).order('inicio'),
    supabase.from('agendamentos').select(CAMPOS_AGENDAMENTO)
      .or(`cliente_id.eq.${user.id},profissional_id.eq.${user.id}`)
      .lt('inicio', agora).order('inicio', { ascending: false }).limit(20),
  ])

  return (
    <div className="pagina-branca">
      <CabecalhoBranco titulo="Minha agenda" />

      <h2>Próximos</h2>
      {proximos?.length ? (
        <ul className="lista-agendamentos">{proximos.map((a) => <CartaoAgendamento key={a.id} a={a} />)}</ul>
      ) : (
        <div className="vazio">
          <p>Nenhum atendimento marcado.</p>
          <Link href="/buscar" className="botao">Buscar profissionais</Link>
        </div>
      )}

      {anteriores?.length > 0 && (
        <>
          <h2>Anteriores</h2>
          <ul className="lista-agendamentos">{anteriores.map((a) => <CartaoAgendamento key={a.id} a={a} />)}</ul>
        </>
      )}
    </div>
  )
}
