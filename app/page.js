import Link from 'next/link'
import { IconeCasaCoracao, IconeMaleta, IconeSeta } from '@/components/Icones'

export default function Inicio() {
  return (
    <div className="folha inicio">
      <h1>Cuidado pessoal em casa, com a família por perto mesmo de longe.</h1>
      <p className="lead">
        Manicure, cabelo e barba no endereço de quem tem dificuldade para sair.
        Você agenda para você ou para alguém da sua família.
      </p>

      <h2 className="h3">Como você quer usar o Vem Até Mim?</h2>
      <div className="escolhas">
        <Link href="/cadastro?tipo=cliente" className="escolha">
          <span className="icone"><IconeCasaCoracao /></span>
          <span>
            <strong>Quero contratar um serviço</strong>
            <span className="texto-escolha">Para mim ou para alguém da minha família.</span>
          </span>
          <IconeSeta className="seta" width="28" height="28" />
        </Link>
        <Link href="/cadastro?tipo=profissional" className="escolha">
          <span className="icone"><IconeMaleta /></span>
          <span>
            <strong>Quero oferecer meus serviços</strong>
            <span className="texto-escolha">Sou manicure, cabeleireira, barbeiro ou faço outro cuidado pessoal.</span>
          </span>
          <IconeSeta className="seta" width="28" height="28" />
        </Link>
      </div>

      <p>
        Já tem conta? <Link href="/entrar">Entrar</Link>
      </p>
    </div>
  )
}
