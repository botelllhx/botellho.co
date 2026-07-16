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

Em português. As rotas EN antigas continuam funcionando por redirect.

- `/` home (hero: o diorama 3D do Ban)
- `/estudio` o estúdio
- `/trabalhos` e `/trabalhos/:slug` cases (Supabase)
- `/laboratorio` experimentos e teardowns
- `/contato` contato
- `/admin` área privada (Supabase auth, fora do sitemap e bloqueada no robots)

### Redirects das rotas antigas: decisão conhecida

`/studio`, `/work`, `/work/:slug`, `/lab` e `/contact` redirecionam via `<Navigate>`
no cliente, **não** por 301 de servidor: o GitHub Pages não emite 301. O Google
segue redirect de cliente, mas passa menos autoridade que um 301. É uma limitação
da hospedagem, não um descuido. Se um dia o site sair do Pages, vale trocar por
301 de verdade.

## Como o SSG e o sitemap funcionam

`vite-react-ssg` pré-renderiza cada rota pública em HTML de verdade no build, então
o conteúdo chega pronto no DOM (não depende de JS pra ser indexado). As rotas
vivem em `STATIC_ROUTES`, no `vite.config.ts`, que é a fonte única para dois
consumidores:

1. **pré-render**: quais páginas viram HTML estático
2. **sitemap.xml**: gerado no `onFinished` do build, com `lastmod` do dia

Os slugs dos cases entram no pré-render e no sitemap lendo o Supabase **no momento
do build** (só os `published`). Sem credenciais no ambiente (dev local), a lista
volta vazia e os cases não pré-renderizam: isso é esperado, eles só congelam no CI.

O mesmo `onFinished` remove qualquer `.md` do `dist`. Tudo em `public/` é servido
na raiz do domínio, e documento interno ali vaza (a direção criativa já esteve
pública e indexável em `/docs/`). Fonte de asset e documento interno ficam em
`assets/` e `docs/`, fora do `public/`.

## Hero 3D

O diorama é carregado sob demanda (`HeroSlot`): Three + R3F + postprocessing somam
~1MB e ficam num chunk separado, que só baixa quando o hero entra na viewport.
Em `prefers-reduced-motion` ou aparelho fraco, entra o `hero-fallback.png` estático
no lugar do canvas.

O pipeline de render tem ordem obrigatória: **Moebius (full-res) → Retro (1-bit) →
CRT**. O Moebius roda em passe próprio (marcado como `CONVOLUTION`) justamente pra
o contorno ser calculado em resolução cheia antes do Retro pixelizar.

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

Push na `main` dispara `.github/workflows/deploy.yml`, que builda e publica o
conteúdo estático em `gh-pages`. O `CNAME` mantém o domínio `botellho.com`.

Atenção: **todo push na `main` publica**. Não há passo de aprovação entre o merge
e o site no ar.

## Assets sociais

`og-image.jpg` e `apple-touch-icon.png` são gerados por `scripts/gen-og-assets.mjs` (requer `sharp` como dev).

## Mídia da home

Os clipes da seção "regras da casa" são `<video>` (mp4 + webm), não gif: os gifs
originais somavam 19MB e viraram 1.5MB sem perda visível. Para adicionar um novo,
veja `public/gifs/README.md`.
