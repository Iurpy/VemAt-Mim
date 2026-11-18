import ListaFamilia from './ListaFamilia'

export const metadata = { title: 'Minha família · Vem Até Mim' }

export default async function PaginaFamilia({ searchParams }) {
  const { aviso } = await searchParams
  return <ListaFamilia aviso={aviso} />
}
