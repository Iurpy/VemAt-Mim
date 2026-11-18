import Link from 'next/link'

export default function Inicio() {
  return (
    <section className="inicio">
      <h1>Cuidado pessoal em casa, com a família por perto mesmo de longe.</h1>
      <p className="lead">
        Manicure, cabelo e barba no endereço de quem tem dificuldade para sair.
        Você agenda para você ou para alguém da sua família.
      </p>

      <div className="escolhas">
        <Link href="/cadastro?tipo=cliente" className="escolha">
          <strong>Quero contratar um serviço</strong>
          <span>Para mim ou para alguém da minha família.</span>
        </Link>
        <Link href="/cadastro?tipo=profissional" className="escolha">
          <strong>Quero oferecer meus serviços</strong>
          <span>Sou manicure, cabeleireira, barbeiro ou faço outro cuidado pessoal.</span>
        </Link>
      </div>

      <p>
        Já tem conta? <Link href="/entrar">Entrar</Link>
      </p>
    </section>
  )
}
