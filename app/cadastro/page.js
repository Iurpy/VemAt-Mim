import FormCadastro from './FormCadastro'

export const metadata = { title: 'Criar conta · Vem Até Mim' }

export default async function PaginaCadastro({ searchParams }) {
  const { tipo } = await searchParams
  const tipoInicial = tipo === 'cliente' || tipo === 'profissional' ? tipo : null
  return (
    <div className="folha">
      <FormCadastro tipoInicial={tipoInicial} />
    </div>
  )
}
