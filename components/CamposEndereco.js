'use client'

import { useState } from 'react'
import Campo from './Campo'
import { buscarCep, formatarCep, soDigitos } from '@/lib/formatos'

// Bloco de endereço usado no perfil e no cadastro de familiares.
// Ao digitar os 8 números do CEP, preenche rua, bairro, cidade e estado.
export default function CamposEndereco({ valores, alterar, erros = {}, titulo = 'Endereço' }) {
  const [status, setStatus] = useState('')

  async function aoMudarCep(evento) {
    const cep = formatarCep(evento.target.value)
    alterar('cep', cep)

    if (soDigitos(cep).length !== 8) {
      setStatus('')
      return
    }

    setStatus('Procurando o endereço...')
    const endereco = await buscarCep(cep)

    if (endereco) {
      alterar('logradouro', endereco.logradouro)
      alterar('bairro', endereco.bairro)
      alterar('cidade', endereco.cidade)
      alterar('uf', endereco.uf)
      setStatus('Endereço encontrado. Confira e preencha o número.')
      document.getElementById('numero')?.focus()
    } else {
      setStatus('Não encontramos esse CEP. Preencha o endereço abaixo.')
    }
  }

  const campo = (nome) => ({
    value: valores[nome],
    onChange: (e) => alterar(nome, e.target.value),
    erro: erros[nome],
  })

  return (
    <fieldset className="grupo">
      <legend>{titulo}</legend>

      <Campo
        id="cep"
        rotulo="CEP"
        ajuda="Digite os 8 números. O resto do endereço aparece sozinho."
        inputMode="numeric"
        autoComplete="postal-code"
        value={valores.cep}
        onChange={aoMudarCep}
        erro={erros.cep}
        style={{ maxWidth: '12rem' }}
      />
      <p className="status-cep" role="status" aria-live="polite">{status}</p>

      <Campo id="logradouro" rotulo="Rua" autoComplete="address-line1" {...campo('logradouro')} />

      <div className="linha">
        <Campo id="numero" rotulo="Número" {...campo('numero')} style={{ maxWidth: '10rem' }} />
        <Campo id="complemento" rotulo="Complemento" opcional ajuda="Ex.: casa 2, apto 101" autoComplete="address-line2" {...campo('complemento')} />
      </div>

      <Campo id="bairro" rotulo="Bairro" {...campo('bairro')} />

      <div className="linha">
        <Campo id="cidade" rotulo="Cidade" autoComplete="address-level2" {...campo('cidade')} />
        <Campo id="uf" rotulo="Estado (sigla)" autoComplete="address-level1" maxLength={2} {...campo('uf')} style={{ maxWidth: '7rem', textTransform: 'uppercase' }} />
      </div>

      <Campo id="ponto_referencia" rotulo="Ponto de referência" opcional ajuda="Ex.: em frente à padaria" {...campo('ponto_referencia')} />

      <Campo
        id="acesso_ao_imovel"
        rotulo="Algo que a profissional precisa saber para chegar ou atender?"
        opcional
        multilinha
        rows={3}
        maxLength={300}
        ajuda='Ex.: "2º andar sem elevador", "tocar a campainha duas vezes". Não escreva diagnósticos ou informações de saúde.'
        {...campo('acesso_ao_imovel')}
      />
    </fieldset>
  )
}
