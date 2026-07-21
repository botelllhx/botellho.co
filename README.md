# botellho

Portfólio pessoal de **Mateus Botelho**, desenvolvedor criativo. Sites, experiências 3D e WebGL, motion e direção de arte, para marcas, cultura e instituições.

**Site:** https://botellho.com

O próprio site é a peça: uma interface com estética 1-bit e linguagem de terminal, com um diorama 3D interativo na home.

## Stack

- Vite, React e TypeScript
- Tailwind CSS e shadcn/ui (Radix)
- Three.js, React Three Fiber e postprocessing (shaders próprios)
- GSAP e Lenis
- Supabase (conteúdo do portfólio), EmailJS e reCAPTCHA (contato)
- vite-react-ssg (pré-render por rota) e react-helmet-async
- GitHub Pages

## Requisitos

- Node 20+

## Rodando localmente

```bash
npm install
cp .env.example .env   # preencha as chaves de Supabase, EmailJS e reCAPTCHA
npm run dev
```

## Scripts

```bash
npm run dev      # desenvolvimento (Vite)
npm run build    # build estático com pré-render (vite-react-ssg)
npm run preview  # serve o build localmente
npm run lint     # ESLint
npm run test     # Vitest
```

## Rotas

Em português. As rotas antigas em inglês redirecionam para as equivalentes.

- `/` home, com o hero 3D
- `/sobre` sobre
- `/trabalhos` e `/trabalhos/:slug` cases
- `/laboratorio` experimentos e notas técnicas
- `/contato` contato

## Arquitetura

### Pré-render e SEO

`vite-react-ssg` pré-renderiza cada rota pública em HTML no build, então o conteúdo chega pronto no DOM sem depender de JavaScript para ser indexado. As rotas ficam em `STATIC_ROUTES` (`vite.config.ts`), fonte única para dois consumidores: o pré-render e o `sitemap.xml`, gerado no build com a data do dia. Os cases publicados entram lendo o Supabase no momento do build.

### Hero 3D

O diorama é carregado sob demanda (`HeroSlot`): Three, R3F e postprocessing somam cerca de 1 MB e ficam num chunk separado, baixado só quando o hero entra na viewport. Em `prefers-reduced-motion` ou em aparelhos limitados, o canvas não é carregado.

O pipeline de render tem ordem definida: **Moebius (resolução cheia), depois Retro (1-bit), depois CRT**. O passe do Moebius roda separado para o contorno ser calculado em resolução cheia antes da pixelização.

## Deploy

O push na `main` dispara `.github/workflows/deploy.yml`, que builda e publica o estático em `gh-pages`. O `CNAME` mantém o domínio.

## Créditos

Atribuições de terceiros (modelo 3D, fontes) em [CREDITS.md](CREDITS.md).
