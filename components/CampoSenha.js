'use client'

import { useState } from 'react'

// Campo de senha com botão para mostrar o que foi digitado
export default function CampoSenha({ id, rotulo, ajuda, erro, ...props }) {
  const [visivel, setVisivel] = useState(false)
  const idAjuda = ajuda ? `${id}-ajuda` : null
  const idErro = erro ? `${id}-erro` : null
  const descricao = [idAjuda, idErro].filter(Boolean).join(' ') || undefined

  return (
    <div className={`campo${erro ? ' com-erro' : ''}`}>
      <label htmlFor={id}>{rotulo}</label>
      {ajuda && <p id={idAjuda} className="ajuda">{ajuda}</p>}
      <div className="senha">
        <input
          id={id}
          name={id}
          type={visivel ? 'text' : 'password'}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descricao}
          {...props}
        />
        <button
          type="button"
          className="botao secundario"
          aria-pressed={visivel}
          onClick={() => setVisivel(!visivel)}
        >
          {visivel ? 'Esconder senha' : 'Mostrar senha'}
        </button>
      </div>
      {erro && <p id={idErro} className="erro-campo">{erro}</p>}
    </div>
  )
}
