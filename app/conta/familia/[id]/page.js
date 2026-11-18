import FormFamiliar from '../FormFamiliar'

export const metadata = { title: 'Editar familiar · Vem Até Mim' }

export default async function PaginaEditarFamiliar({ params }) {
  const { id } = await params
  return <FormFamiliar id={id} />
}
