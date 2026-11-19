// Textos e formatos usados nas listas de agendamento

export const STATUS = {
  aguardando_pagamento: { rotulo: 'Aguardando pagamento', classe: 'alerta' },
  confirmado: { rotulo: 'Confirmado', classe: 'ok' },
  em_atendimento: { rotulo: 'Em atendimento', classe: 'ok' },
  aguardando_confirmacao: { rotulo: 'Confirme o atendimento', classe: 'alerta' },
  concluido: { rotulo: 'Concluído', classe: 'neutro' },
  cancelado: { rotulo: 'Cancelado', classe: 'neutro' },
  em_analise: { rotulo: 'Em análise', classe: 'alerta' },
}

const fuso = 'America/Fortaleza'

export function diaSemanaCurto(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { weekday: 'short', timeZone: fuso }).replace('.', '').toUpperCase()
}
export function diaDoMes(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', timeZone: fuso })
}
export function dataHoraLonga(iso) {
  return new Date(iso).toLocaleString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: fuso,
  })
}

export const CAMPOS_AGENDAMENTO =
  'id, inicio, status, nome_atendido, bairro, servicos(nome), profissionais(perfis(nome))'
