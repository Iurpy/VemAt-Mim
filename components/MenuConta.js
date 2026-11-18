'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITENS = [
  { href: '/conta', rotulo: 'Início' },
  { href: '/conta/perfil', rotulo: 'Meu perfil' },
  { href: '/conta/familia', rotulo: 'Minha família' },
]

export default function MenuConta() {
  const caminho = usePathname()
  const ativo = (href) => (href === '/conta' ? caminho === '/conta' : caminho.startsWith(href))

  return (
    <nav aria-label="Minha conta">
      <ul className="menu-conta">
        {ITENS.map((item) => (
          <li key={item.href}>
            <Link href={item.href} aria-current={ativo(item.href) ? 'page' : undefined}>
              {item.rotulo}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
