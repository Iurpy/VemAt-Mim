import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function Logo({ href = '/', escuro = false }) {
  return (
    <Link href={href} className={escuro ? 'logo escuro' : 'logo'}>
      <span className="logo-marca" aria-hidden="true">
        <Heart size={18} strokeWidth={2.6} fill="currentColor" />
      </span>
      <span>Vem Até <span className="mim">Mim</span></span>
    </Link>
  )
}
