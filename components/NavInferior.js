'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, House, Search, User } from 'lucide-react'
import Logo from './Logo'

const ITENS = [
  { href: '/conta', rotulo: 'Início', Icone: House },
  { href: '/buscar', rotulo: 'Buscar', Icone: Search },
  { href: '/conta/agenda', rotulo: 'Agenda', Icone: Calendar },
  { href: '/conta/perfil', rotulo: 'Perfil', Icone: User },
]

export default function NavInferior() {
  const caminho = usePathname()
  const ativo = (href) =>
    href === '/conta'
      ? caminho === '/conta'
      : href === '/conta/perfil'
        ? caminho.startsWith('/conta/perfil') || caminho.startsWith('/conta/familia')
        : caminho.startsWith(href)

  return (
    <nav className="nav-inferior" aria-label="Menu principal">
      <div className="nav-logo"><Logo href="/conta" escuro /></div>
      <ul>
        {ITENS.map(({ href, rotulo, Icone }) => (
          <li key={href}>
            <Link href={href} aria-current={ativo(href) ? 'page' : undefined}>
              <span className="nav-icone"><Icone size={24} aria-hidden="true" /></span>
              {rotulo}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
