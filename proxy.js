import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Roda antes de cada página: renova a sessão e protege a área /conta
export async function proxy(request) {
  let resposta = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(lista, headers) {
          lista.forEach(({ name, value }) => request.cookies.set(name, value))
          resposta = NextResponse.next({ request })
          lista.forEach(({ name, value, options }) => resposta.cookies.set(name, value, options))
          Object.entries(headers ?? {}).forEach(([chave, valor]) => resposta.headers.set(chave, valor))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const caminho = request.nextUrl.pathname

  // Sem login tentando entrar na conta: manda para /entrar e depois volta
  if (!user && caminho.startsWith('/conta')) {
    const url = request.nextUrl.clone()
    url.pathname = '/entrar'
    url.search = `?voltar=${encodeURIComponent(caminho)}`
    return NextResponse.redirect(url)
  }

  // Já logado vai direto para o início da conta
  if (user && (caminho === '/' || caminho === '/entrar' || caminho === '/cadastro')) {
    const url = request.nextUrl.clone()
    url.pathname = '/conta'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return resposta
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}
