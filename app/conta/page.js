import Link from 'next/link'
import { criarClienteServidor } from '@/lib/supabase/server'
import { IconeFamilia, IconePerfil } from '@/components/Icones'

export const metadata = { title: 'Minha conta · Vem Até Mim' }

export default async function PaginaConta() {
  const supabase = await criarClienteServidor()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: perfil } = await supabase
    .from('perfis')
    .select('nome, tipo, cep')
    .eq('id', user.id)
    .single()

  const { count: totalFamiliares } = await supabase
    .from('familiares')
    .select('id', { count: 'exact', head: true })

  const primeiroNome = perfil?.nome?.split(' ')[0] ?? ''
  const semEndereco = !perfil?.cep

  return (
    <div>
      <div className="saudacao">
        <span className="avatar" aria-hidden="true">{primeiroNome.charAt(0).toUpperCase()}</span>
        <div>
          <p>Bem-vindo(a) de volta</p>
          <h1>Olá, {primeiroNome}!</h1>
        </div>
      </div>

      {semEndereco && (
        <div className="aviso info">
          <p>
            <strong>Falta o seu endereço.</strong>{' '}
            {perfil?.tipo === 'profissional'
              ? 'Ele mostra às famílias de onde você sai para atender.'
              : 'Ele é usado quando você agenda um atendimento para você.'}
          </p>
          <Link href="/conta/perfil" className="botao pequeno">Completar meu endereço</Link>
        </div>
      )}

      {perfil?.tipo === 'profissional' && (
        <div className="aviso info">
          <p>
            <strong>Em breve:</strong> aqui você vai cadastrar seus serviços, seus preços,
            os bairros onde atende e seus horários.
          </p>
        </div>
      )}

      <ul className="lista">
        <li className="item">
          <span className="etiqueta"><IconeFamilia width="18" height="18" style={{ verticalAlign: '-3px' }} /> Família</span>
          <h2 className="h3">Minha família</h2>
          <p className="detalhe">
            {totalFamiliares
              ? `${totalFamiliares} ${totalFamiliares === 1 ? 'pessoa cadastrada' : 'pessoas cadastradas'}.`
              : 'Cadastre quem você quer ajudar a agendar, como pais ou avós.'}
          </p>
          <Link href="/conta/familia" className="botao pequeno secundario">Ver minha família</Link>
        </li>
        <li className="item">
          <span className="etiqueta"><IconePerfil width="18" height="18" style={{ verticalAlign: '-3px' }} /> Perfil</span>
          <h2 className="h3">Meu perfil</h2>
          <p className="detalhe">Seus dados, endereço e como prefere ver o site.</p>
          <Link href="/conta/perfil" className="botao pequeno secundario">Ver meu perfil</Link>
        </li>
      </ul>
    </div>
  )
}
