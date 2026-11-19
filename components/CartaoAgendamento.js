import { STATUS, dataHoraLonga, diaDoMes, diaSemanaCurto } from '@/lib/agendamentos'

export default function CartaoAgendamento({ a }) {
  const status = STATUS[a.status] ?? { rotulo: a.status, classe: 'neutro' }
  const profissional = a.profissionais?.perfis?.nome
  return (
    <li className="cartao-agendamento">
      <div className="data-bloco" aria-hidden="true">
        <span>{diaSemanaCurto(a.inicio)}</span>
        <strong>{diaDoMes(a.inicio)}</strong>
      </div>
      <div className="agendamento-texto">
        <div className="agendamento-topo">
          <h3>{a.servicos?.nome}</h3>
          <span className={`chip-status ${status.classe}`}>{status.rotulo}</span>
        </div>
        <p>{dataHoraLonga(a.inicio)}</p>
        <p className="fraco">
          {profissional ? `Com ${profissional}` : ''}{profissional ? ', ' : ''}para {a.nome_atendido}
        </p>
      </div>
    </li>
  )
}
