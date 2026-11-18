'use client'

import { useEffect, useState } from 'react'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { TAMANHOS, aplicarPreferencias, lerPreferencias } from '@/lib/preferencias'

// Botões do topo para aumentar a letra e ligar o alto contraste.
// Para quem tem login, a escolha também fica salva no perfil.
export default function ControlesAcessibilidade() {
  const [prefs, setPrefs] = useState({ tamanho: 2, contraste: false })

  useEffect(() => {
    setPrefs(lerPreferencias())

    // Se tiver login, a preferência do perfil vale mais que a do navegador
    const supabase = criarClienteNavegador()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase
        .from('perfis')
        .select('tamanho_fonte, alto_contraste')
        .eq('id', user.id)
        .single()
      if (data) {
        const doPerfil = { tamanho: data.tamanho_fonte, contraste: data.alto_contraste }
        aplicarPreferencias(doPerfil)
        setPrefs(doPerfil)
      }
    })

    // Mantém os botões certos quando a tela de perfil muda as preferências
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
      <div role="group" aria-label="Tamanho da letra" className="tamanhos">
        <span aria-hidden="true">Letra</span>
        {TAMANHOS.map((t) => (
          <button
            key={t.valor}
            type="button"
            className={`tamanho-${t.valor}`}
            aria-pressed={prefs.tamanho === t.valor}
            aria-label={`Letra ${t.nome.toLowerCase()}`}
            onClick={() => mudar({ ...prefs, tamanho: t.valor })}
          >
            A
          </button>
        ))}
      </div>
      <button
        type="button"
        className="contraste"
        aria-pressed={prefs.contraste}
        onClick={() => mudar({ ...prefs, contraste: !prefs.contraste })}
      >
        Alto contraste
      </button>
    </div>
  )
}
