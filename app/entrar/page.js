import FormEntrar from './FormEntrar'

export const metadata = { title: 'Entrar · Vem Até Mim' }

export default async function PaginaEntrar({ searchParams }) {
  const { voltar } = await searchParams
  // Só aceita voltar para páginas do próprio site
  const destino = typeof voltar === 'string' && voltar.startsWith('/') && !voltar.startsWith('//') ? voltar : '/conta'
  return (
    <div className="folha">
      <FormEntrar destino={destino} />
    </div>
  )
}
