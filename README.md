# botellho

Estúdio de web e experiências digitais. Site do estúdio: sites institucionais, experiências 3D e WebGL, motion e direção de arte para marcas, cultura e instituições.

Domínio canônico: https://botellho.com

## Stack

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui (Radix)
- Three.js, GSAP, Lenis, Framer Motion, split-type
- Supabase (portfólio e admin), EmailJS + reCAPTCHA (contato)
- vite-react-ssg (SSG por rota) + react-helmet-async (head por rota)
- Deploy: GitHub Pages (branch `gh-pages`, via GitHub Actions)

## Requisitos

- Node 20+

## Instalação

```bash
npm install
cp .env.example .env
```

Preencha o `.env` com as chaves de Supabase, EmailJS e reCAPTCHA.

## Scripts

```bash
npm run dev      # desenvolvimento (Vite)
npm run build    # build estático com SSG (vite-react-ssg)
npm run preview  # serve o build local
npm run lint     # ESLint
npm run test     # Vitest
```

## Rotas

- `/` home
- `/studio` manifesto do estúdio
- `/work` e `/work/:slug` cases (Supabase)
- `/lab` experimentos e teardowns
- `/admin` área privada (Supabase auth)

## Supabase (portfólio e admin)

- Dados públicos do portfólio: tabela `portfolio_projects`
- Mídia: bucket `portfolio-media`
- Autenticação da área privada: Supabase Auth (email/senha)

Setup:

1. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no `.env`.
2. Rode `supabase/schema.sql` no SQL Editor do Supabase.
3. Crie seu usuário no Supabase Auth.
4. Cadastre o usuário como admin:
   ```sql
   insert into public.admin_users (user_id) values ('SEU_AUTH_USER_UUID');
   ```
5. Acesse `/admin` para administrar os projetos.

## Deploy

Push na `main` dispara `.github/workflows/deploy.yml`, que builda e publica o conteúdo estático em `gh-pages`. O `CNAME` mantém o domínio `botellho.com`. As rotas públicas e o `sitemap.xml` são geradas no build.

## Assets sociais

`og-image.jpg` e `apple-touch-icon.png` são gerados por `scripts/gen-og-assets.mjs` (requer `sharp` como dev).
