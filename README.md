# Vem Até Mim

Site da startup Vem Até Mim (IFCE Campus Maracanaú), feito com Next.js e Supabase.

## O que já funciona (Etapa 3)

- Cadastro com a escolha **"Quero contratar um serviço"** ou **"Quero oferecer meus serviços"**
- Entrar e sair
- **Meu perfil**: dados pessoais, endereço (preenchido pelo CEP) e preferências de acessibilidade
- **Minha família**: cadastrar, listar, editar e excluir familiares (CRUD completo)
- Botões de **tamanho da letra** e **alto contraste** em todas as páginas

## Como rodar no seu computador

1. Instale o **Node.js 20.9 ou mais novo** (https://nodejs.org).
2. Na pasta do projeto, rode:
   ```
   npm install
   ```
3. Copie o arquivo `.env.local.example` para `.env.local` e preencha:
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase > Project Settings > API > Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: na mesma tela, a chave **anon** (ou **publishable**).
     Nunca use a chave `service_role` aqui.
4. Rode:
   ```
   npm run dev
   ```
5. Abra http://localhost:3000

## Configuração do Supabase

O banco precisa estar criado com `v2_01_modelo.sql` e `v2_02_seguranca.sql`.

Em **Authentication**:

- **Para testar mais rápido**: em *Sign In / Providers > Email*, desligue **Confirm email**.
  Assim a conta já entra logada depois do cadastro. Antes de apresentar, ligue de novo.
- Em *URL Configuration*, coloque `http://localhost:3000` em **Site URL**
  (depois, troque pelo endereço do site publicado).

Para virar admin (equipe), cadastre-se normalmente e rode no SQL Editor:

```sql
update perfis set tipo = 'admin'
where id = (select id from auth.users where email = 'seu@email.com');
```

## Organização das pastas

```
app/                     páginas (cada pasta é um endereço do site)
  page.js                página inicial
  cadastro/              criar conta
  entrar/                login
  conta/                 área logada (protegida)
    perfil/              meu perfil (READ e UPDATE)
    familia/             minha família (CREATE, READ, UPDATE, DELETE)
components/              pedaços reutilizáveis (campos, endereço, cabeçalho...)
lib/
  supabase/              conexão com o Supabase (navegador e servidor)
  formatos.js            CEP, telefone, validações
  erros.js               mensagens de erro em português
  preferencias.js        tamanho da letra e contraste
proxy.js                 protege /conta e renova o login
```

## Roteiro de testes do CRUD

**Cadastro e login**
- [x] Criar conta como "Quero contratar". Conferir em Table Editor > `perfis` que o tipo ficou `cliente`.
- [x] Criar outra conta como "Quero oferecer". Conferir `tipo = profissional` e uma linha nova em `profissionais`.
- [x] Tentar cadastrar com o mesmo e-mail: deve aparecer "Já existe uma conta com esse e-mail".
- [x] Sair e tentar abrir http://localhost:3000/conta: deve mandar para "Entrar".
- [x] Entrar com senha errada: mensagem em português.

**Perfil**
- [x] Digitar um CEP de Maracanaú (ex.: 61900-000): rua, bairro, cidade e estado aparecem sozinhos.
- [x] Salvar sem número: o erro aparece no topo e ao lado do campo.
- [x] Mudar a letra para "Muito grande", salvar, sair e entrar de novo: a letra continua grande.

**Família**
- [x] Cadastrar sem marcar a confirmação: deve pedir para marcar.
- [x] Cadastrar a avó: aparece na lista com o aviso "Familiar cadastrado".
- [x] Editar o bairro dela e salvar.
- [x] Excluir: aparece a confirmação; "Não, manter" cancela; "Sim, excluir" apaga.
- [x] Entrar com a outra conta: a família da primeira **não** aparece.

**Acessibilidade**
- [x] Navegar só com a tecla Tab: o contorno amarelo mostra onde você está.
- [ ] Testar o alto contraste e a letra "Muito grande" no celular.
- [ ] Dar zoom no celular com dois dedos: precisa funcionar.
