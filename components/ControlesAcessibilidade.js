'use client'

import { useEffect, useState } from 'react'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { TAMANHOS, aplicarPreferencias, lerPreferencias } from '@/lib/preferencias'

// Botões de tamanho da letra e alto contraste.
// Para quem tem login, a escolha também fica salva no perfil.
export default function ControlesAcessibilidade() {
  const [prefs, setPrefs] = useState({ tamanho: 2, contraste: false })

  useEffect(() => {
    setPrefs(lerPreferencias())
    const ouvir = (e) => setPrefs(e.detail)
    window.addEventListener('preferencias-mudaram', ouvir)
    return () => window.removeEventListener('preferencias-mudaram', ouvir)
  }, [])

  async function mudar(novas) {
    aplicarPreferencias(novas)
    setPrefs(novas)
    const supabase = criarClienteNavegador()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('perfis')
        .update({ tamanho_fonte: novas.tamanho, alto_contraste: novas.contraste })
        .eq('id', user.id)
    }
  }

  return (
    <div className="acessibilidade">
      <p className="acess-titulo" id="titulo-letra">Tamanho da letra</p>
      <div role="group" aria-labelledby="titulo-letra" className="tamanhos">
        {TAMANHOS.map((t) => (
          <button
            key={t.valor}
            type="button"
            className={`tamanho-${t.valor}`}
            aria-pressed={prefs.tamanho === t.valor}
            onClick={() => mudar({ ...prefs, tamanho: t.valor })}
          >
            <span aria-hidden="true">A</span>
            <span className="tamanho-nome">{t.nome}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="contraste"
        aria-pressed={prefs.contraste}
        onClick={() => mudar({ ...prefs, contraste: !prefs.contraste })}
      >
        Alto contraste {prefs.contraste ? 'ligado' : 'desligado'}
      </button>
    </div>
  )
}
