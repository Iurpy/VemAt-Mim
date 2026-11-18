// Funções pequenas de formatação e validação usadas nos formulários

export const soDigitos = (valor) => (valor || '').replace(/\D/g, '')

export function formatarCep(valor) {
  const d = soDigitos(valor).slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

export function formatarTelefone(valor) {
  const d = soDigitos(valor).slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export const telefoneValido = (valor) => [10, 11].includes(soDigitos(valor).length)
export const emailValido = (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((valor || '').trim())

// Busca rua, bairro, cidade e UF pelo CEP (serviço gratuito ViaCEP)
export async function buscarCep(cep) {
  const d = soDigitos(cep)
  if (d.length !== 8) return null
  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${d}/json/`)
    if (!resposta.ok) return null
    const json = await resposta.json()
    if (json.erro) return null
    return {
      logradouro: json.logradouro || '',
      bairro: json.bairro || '',
      cidade: json.localidade || '',
      uf: json.uf || '',
    }
  } catch {
    return null
  }
}

// Endereço vazio, usado como valor inicial dos formulários
export const enderecoVazio = {
  cep: '', logradouro: '', numero: '', complemento: '', bairro: '',
  cidade: '', uf: '', ponto_referencia: '', acesso_ao_imovel: '',
}

// Converte o endereço vindo do banco (CEP só com números) para a tela
export function enderecoParaTela(linha) {
  const e = { ...enderecoVazio }
  for (const chave of Object.keys(e)) e[chave] = linha?.[chave] ?? ''
  e.cep = formatarCep(e.cep)
  return e
}

// Converte o endereço da tela para o banco (vazio vira null)
export function enderecoParaBanco(e) {
  const vazioViraNull = (v) => (v && v.trim() ? v.trim() : null)
  return {
    cep: soDigitos(e.cep) || null,
    logradouro: vazioViraNull(e.logradouro),
    numero: vazioViraNull(e.numero),
    complemento: vazioViraNull(e.complemento),
    bairro: vazioViraNull(e.bairro),
    cidade: vazioViraNull(e.cidade),
    uf: e.uf ? e.uf.trim().toUpperCase() : null,
    ponto_referencia: vazioViraNull(e.ponto_referencia),
    acesso_ao_imovel: vazioViraNull(e.acesso_ao_imovel),
  }
}

// Valida o endereço. Retorna { campo: 'mensagem' } só com os campos com problema
export function validarEndereco(e) {
  const erros = {}
  if (soDigitos(e.cep).length !== 8) erros.cep = 'Digite o CEP com 8 números.'
  if (!e.logradouro.trim()) erros.logradouro = 'Digite o nome da rua.'
  if (!e.numero.trim()) erros.numero = 'Digite o número da casa. Se não tiver, escreva "S/N".'
  if (!e.bairro.trim()) erros.bairro = 'Digite o bairro.'
  if (!e.cidade.trim()) erros.cidade = 'Digite a cidade.'
  if (e.uf.trim().length !== 2) erros.uf = 'Digite a sigla do estado, por exemplo CE.'
  return erros
}

export const enderecoEmBranco = (e) =>
  !soDigitos(e.cep) && !e.logradouro.trim() && !e.numero.trim() && !e.bairro.trim() && !e.cidade.trim()

export function resumoEndereco(e) {
  if (!e?.logradouro) return ''
  const partes = [`${e.logradouro}, ${e.numero}`]
  if (e.complemento) partes[0] += ` (${e.complemento})`
  partes.push(e.bairro)
  partes.push(`${e.cidade}/${e.uf}`)
  return partes.join(' · ')
}
