import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// Cabeçalho das telas brancas: seta de voltar e título
export default function CabecalhoBranco({ titulo, voltar, rotuloVoltar = 'Voltar', direita }) {
  return (
    <div className="cabecalho-branco">
      {voltar && (
        <Link href={voltar} className="botao-redondo" aria-label={rotuloVoltar}>
          <ArrowLeft size={24} aria-hidden="true" />
        </Link>
      )}
      <h1>{titulo}</h1>
      {direita && <div className="cabecalho-direita">{direita}</div>}
    </div>
  )
}
