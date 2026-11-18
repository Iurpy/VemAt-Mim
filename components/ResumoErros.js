'use client'

import { useEffect, useRef } from 'react'

// Caixa no topo do formulário que lista o que precisa ser corrigido.
// Recebe o foco quando aparece, para quem usa leitor de tela ou teclado.
export default function ResumoErros({ erros, mensagem }) {
  const ref = useRef(null)
  const lista = Object.entries(erros || {})
  const temAlgo = lista.length > 0 || mensagem

  useEffect(() => {
    if (temAlgo) ref.current?.focus()
  }, [temAlgo, erros, mensagem])

  if (!temAlgo) return null

  return (
    <div className="aviso erro" role="alert" tabIndex={-1} ref={ref}>
      {mensagem && <p><strong>{mensagem}</strong></p>}
      {lista.length > 0 && (
        <>
          <p><strong>Falta corrigir {lista.length === 1 ? 'uma coisa' : `${lista.length} coisas`}:</strong></p>
          <ul>
            {lista.map(([campo, texto]) => (
              <li key={campo}><a href={`#${campo}`}>{texto}</a></li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
