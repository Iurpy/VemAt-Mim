'use client'

import { useEffect, useRef, useState } from 'react'
import ControlesAcessibilidade from './ControlesAcessibilidade'

// Botão redondo "Aa" no canto do topo: abre as opções de letra e contraste
export default function BotaoLeitura({ claro = false }) {
  const [aberto, setAberto] = useState(false)
  const caixa = useRef(null)
  const botao = useRef(null)

  useEffect(() => {
    if (!aberto) return
    const fecharFora = (e) => { if (!caixa.current?.contains(e.target)) setAberto(false) }
    const fecharEsc = (e) => { if (e.key === 'Escape') { setAberto(false); botao.current?.focus() } }
    document.addEventListener('mousedown', fecharFora)
    document.addEventListener('keydown', fecharEsc)
    return () => {
      document.removeEventListener('mousedown', fecharFora)
      document.removeEventListener('keydown', fecharEsc)
    }
  }, [aberto])

  return (
    <div className="leitura" ref={caixa}>
      <button
        ref={botao}
        type="button"
        className={`botao-redondo ${claro ? '' : 'no-azul'}`}
        aria-expanded={aberto}
        aria-controls="painel-leitura"
        onClick={() => setAberto(!aberto)}
      >
        <span aria-hidden="true" className="aa">Aa</span>
        <span className="so-leitor">Tamanho da letra e contraste</span>
      </button>
      {aberto && (
        <div id="painel-leitura" className="painel-leitura">
          <ControlesAcessibilidade />
        </div>
      )}
    </div>
  )
}
