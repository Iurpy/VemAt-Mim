import './globals.css'
import Cabecalho from '@/components/Cabecalho'
import { scriptPreferencias } from '@/lib/preferencias'

export const metadata = {
  title: 'Vem Até Mim · cuidados pessoais em casa',
  description: 'Manicure, cabelo e barba em casa, com acompanhamento da família.',
}

// Importante: não limitar o zoom (maximumScale), quem enxerga pouco precisa dele
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-fs="2" data-contraste="normal" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: scriptPreferencias }} />
      </head>
      <body>
        <a href="#conteudo" className="pular">Pular para o conteúdo</a>
        <Cabecalho />
        <main id="conteudo" tabIndex={-1}>
          <div className="largura">{children}</div>
        </main>
        <footer className="rodape">
          <div className="largura">
            Vem Até Mim · projeto acadêmico do IFCE Campus Maracanaú.
          </div>
        </footer>
      </body>
    </html>
  )
}
