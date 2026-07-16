# botellho.co — Direção Criativa (v3, consolidada e atualizada)
**Documento único e coerente. Substitui todas as versões anteriores. Pareia com botellho-design-brief.md (sistema/pipeline) e botellho-brief.md (técnico/SEO). Antes de codar cada página, apresentar o conceito e a variação de layout para aprovar.**

---

## 0. Como usar
- Revisão grande, não do zero cego: MANTER o que já está bom (header, filtro P&B da página de trabalhos, as páginas individuais de trabalho, o footer, o efeito de digitado) e RECONSTRUIR o resto conforme abaixo.
- Tudo em português (nav, slugs, UI). Conteúdo em DOM real. Foco nacional.
- A regra-mãe: DOS levado a sério é o corpo de tudo, mas amigável, não assustador. Diversidade real de layout, sem repetir o mesmo conceito em telas seguidas.

## 1. Conceito e tese
botellho é um estúdio de web e experiências digitais com craft de nível de prêmio, que impressiona e converte. Estética de computador antigo (DOS, bitmap, janelas retrô), porém acolhedora e viva, com o Ban como alma. O DOS dá corpo; o conteúdo real e as imagens dão contexto palpável.

## 2. Referências e o que roubar (estudadas seção a seção)
- **basement.studio (referência SUPREMA):** craft, personalidade, tipografia como estrela, seções modulares distintas. Sempre a régua final.
- **area17.com (nosso norte ESTRUTURAL, o maior acerto se acertarmos):** listas em tipografia gigante (ex.: "Industries we serve" com hover), seções de conteúdo densas (Clients, Ideas), e o efeito do LOGO GIGANTE no fim da página, que se esconde atrás de uma seção e se revela grande conforme o scroll. Trazer esse conceito para a home e para o footer.
- **locomotive.ca/en:** headlines editoriais GIGANTES (serifa enorme), glifos de bloco como ornamento, e o efeito real de EMBARALHAMENTO entre palavras (é o scramble que queremos, bem-feito).
- **darkroom.engineering:** mesma família de estética retrô, mas assustadora; a deles ensina a trabalhar em CAMADAS e SEÇÕES. Roubar a estrutura em camadas, manter o nosso tom amigável.
- **instrument.com:** como tratar TRANSIÇÃO DE COR entre seções; fundos azuis e brancos alternando com elegância.
- **Podium e Boulder:** densidade de conteúdo/prova e scroll como narrativa.
- **Poolsuite e Low-Tech Magazine:** DOS/OS de verdade e imagens em dither reais.

## 3. Regras não-negociáveis
PROIBIDO (kill-list): fundo preto em seções (não casou, usar branco e azul); efeito de GLITCH nos textos (terrível, remover de vez); a transição de página com dither ruim (refazer, caminho novo); jargão técnico na copy visível (ex.: "fósforo azul" no footer, sai); COMANDOS de terminal reais na interface (ls, cd, mkdir, etc. — o usuário não sabe o que é); duas seções seguidas com o mesmo conceito de layout; onda no hero.

BEM-VINDO (o oposto do de cima): decoração DOS que NÃO é comando — caminhos como /com-quem-trabalhamos, prompts de flavor como "> volte em breve_", rótulos .txt/.log, glifos de bloco. Isso dá a estética sem confundir. A régua: se parece uma ORDEM que o usuário teria que digitar/entender (ls, cd), sai; se é só textura/rótulo, fica.
SIM: DOS a sério (janelas retrô, bitmap, glifos); imagens reais e gigantes filtradas em bitmap; títulos GIGANTES (às vezes 100% da tela) com variação de fonte; scroll controlando tudo; scramble e digitado bem-feitos; diversidade real de layout.

## 4. Identidade

### 4.1 Cor
- Fundos alternam BRANCO e AZUL (o nosso azul, ~hsl(227 87% 34%)). NADA de fundo preto em seções. Preto (ink) fica para texto e detalhe; sobre o azul, o texto inverte para branco.
- Transição de cor entre seções suave e trabalhada, à la Instrument.
- Copy visível NUNCA expõe termos técnicos internos (o token pode se chamar phosphor no código, mas no site é só "azul" ou nada). Footer: "feito em Belo Horizonte", sem jargão.

### 4.2 Tipografia
- **Archivo Black** e **IBM VGA (int10h)** ALTERNANDO NOS TÍTULOS (a variação de fonte é assinatura; ora grotesca pesada, ora bitmap DOS gigante). A **Averia foi APOSENTADA** — a IBM VGA assume a variação dos títulos. Bitmap/IBM VGA NÃO é fonte de parágrafo.
- **Geist Pixel** para dados, rótulos, chrome de janela e números. **IBM VGA (int10h)** para os momentos bitmap/DOS e como par de variação dos títulos (uso ampliado, no lugar da Averia).
- Títulos GIGANTES, alguns ocupando 100% da largura da tela. Hierarquia limpa, muita variação de escala.

### 4.3 Imagens (contexto real, sempre filtrado)
- Usar imagens REAIS: o Ban, o Mateus, Belo Horizonte. Dão contexto palpável.
- TODA imagem passa por um filtro de BITMAP/DITHER bem-feito (referência das que ele curtiu). Nada de foto "crua".
- Imagens GIGANTES, e os títulos ainda maiores.
- O Ban na horizontal (foto que o Mateus vai anexar em assets) recebe um filtro de bitmap caprichado e é REUTILIZADO bastante pelo site (2D). É diferente do modelo 3D do Ban do hero.

### 4.4 DOS e janelas retrô
- Window-chrome (barra de título, widgets, bordas 3D) levado a sério, mas NÃO em tudo, só onde agrega.
- As janelas retrô têm que ser ARRASTÁVEIS/móveis pela interface; sem isso o conceito não se sustenta.
- Glifos de bloco/seta (▀ ▫ █ ► ↘) como ornamento tipográfico. Rótulos sempre em português claro.
- Bitmap com pixelização CALIBRÁVEL, leve o bastante para preservar o detalhe da
  cena. Não há valor fixo: calibra-se por contexto e trava-se no código (o hero
  usa 2, em `RetroEffect`). A regra antiga de "pixel-size 6 fixo" está APOSENTADA:
  naquele valor a cena vira mancha e a hachura do Moebius some.

## 5. Header
Manter o header atual (o Mateus gosta). Não mexer além do necessário para coerência.

## 6. Motion e scroll (o scroll controla TUDO)
- O scroll comanda tudo: reveal de texto, de imagem e de conteúdo. GSAP + ScrollTrigger sincronizado ao Lenis, um só raf.
- Seções STICKY e seções EMPILHANDO (stacking) de verdade. Camadas à la darkroom.
- Efeito de EMBARALHAMENTO entre palavras bem-feito, à la Locomotive (glifos assentando, elegante).
- Efeito de DIGITADO: manter, é bom e incorpora bem.
- Transição de página: refazer num caminho NOVO (o dither atual é ruim). Algo à altura, coerente com o bitmap/DOS, mas elegante.
- REMOVER o glitch de texto de vez.
- Reveal de texto elegante em todo lugar (não o reveal genérico).

## 7. Variação de layout (a exigência central)
Arquétipos a combinar, com NENHUM vizinho igual e sem repetir o mesmo conceito em telas seguidas:
- Editorial full-bleed com título gigante (100% da tela), à la Locomotive.
- Lista em tipografia gigante com hover (serviços/setores), à la AREA17 "Industries we serve".
- Sticky (uma coluna/painel fixo enquanto o conteúdo passa).
- Stacking (seções empilhando no scroll).
- Split-screen (metade fixa, metade rola).
- Index/list denso (diretório).
- Media grid com imagens GIGANTES filtradas.
- Seções de prova/conteúdo densas (clientes, depoimentos, ideias), à la AREA17/Podium.

## 8. Loader
Muito mais rico: baseado em TEXTO, com espaço em branco e reveal elegante do texto, com cara de boot DOS. É hora de usar e abusar do efeito DOS aqui. Nada de spinner. É a primeira impressão da marca.

## 9. Hero (escopo mantido, com mais animação)
- Mantém o escopo anterior: o ESTÚDIO-DIORAMA DO BAN (cena 3D, quarto/estúdio com o Ban vivendo nele), dentro da moldura de tela CRT, com o texto fora da tela.
- Assets 3D: o Mateus já separou e vai colocar em public/3d (mesa com setup gamer já incluído, cadeira gamer, vaso de planta). Falta só o modelo do Ban. Usar os que ele forneceu.
- MUITO mais animação, e uma animação que conecta a home: a PRÓXIMA seção EMPILHA (stacking scroll) sobre o hero conforme o scroll.
- Renderizado no pipeline Moebius (full-res) → retrô 1-bit (pixelização calibrável
  + Bayer 4x4 + paleta ink/azul/branco) → CRT. A ordem é obrigatória: o Moebius
  precisa rodar em resolução cheia ANTES de pixelizar, senão o contorno nasce
  serrilhado. Fallback estático + reduced-motion + 60fps.

## 10. Footer
Manter o footer atual (o Mateus gosta de tudo nele), MAS adicionar o efeito à la AREA17: o LOGO/wordmark GIGANTE que fica escondido atrás de uma seção e se revela grande conforme o scroll, com transição de seção trabalhada. Tirar o jargão da copy (nada de "fósforo azul").

## 11. Páginas (tudo em português; slugs /trabalhos, /estudio, /laboratorio, /contato)
- **/ (home):** cheia e com conteúdo real. Hero → (empilha) próxima seção → o que fazemos (lista gigante com hover, à la AREA17) → seleção de trabalhos com previews e imagens gigantes filtradas → prova (clientes, setores, depoimentos) → seção de contato embutida → footer com o reveal do logo gigante. Cada seção num arquétipo diferente.
- **/estudio:** manifesto com títulos gigantes (Archivo Black + IBM VGA alternando), como trabalhamos, prova.
- **/trabalhos:** MANTER o filtro preto e branco elegante do índice (o Mateus gosta), e melhorar ainda mais. Previews grandes.
- **/trabalhos/:slug:** MANTER a base das páginas individuais (o Mateus gosta muito), e melhorar: textos às vezes a 100% da tela, gigantes; variação de fonte nos títulos (Archivo Black + IBM VGA); bitmap nunca como parágrafo.
- **/laboratorio:** experimentos e teardowns (motor de SEO de cauda longa).
- **/contato:** formulário como janela retrô arrastável, labels claros em PT, contato por função; nunca vazio na tela.
- **404:** bitmap + Ban, saída clara.

## 12. Idioma e copy
Tudo em português. Copy confiante, específica e SEM jargão técnico visível (citar conceito técnico só o suficiente, e nunca termos internos como "fósforo azul"). Slugs em PT; atualizar sitemap, canonical e links.

## 13. SEO e palavras-chave (nunca esquecer)
Manter e reforçar o trabalho de palavras-chave do brief técnico em cada página; conteúdo real ajuda o ranqueamento. Nada em inglês na nav/slugs.

## 14. Constraints
Preservar a stack (Vite/React/TS/Tailwind/shadcn/Three.js/GSAP/Lenis/Supabase). DOM real. prefers-reduced-motion e 60fps com fallback. Expurgo total do Lovable. Commits pequenos, em branch, SEM coautoria da Claude. Português sem travessão e sem "gestão", sentence case. Seguir a skill frontend-design. build e lint verdes.

## 15. Referências (URLs)
Supremas/estruturais: https://basement.studio/ · https://area17.com/ · https://locomotive.ca/en · https://darkroom.engineering/ · https://www.instrument.com/
Conteúdo/scroll: https://podium.global/ · https://wearebouldergroup.com/ · https://cubo.cx/
DOS/retrô/dither: https://poolsuite.net/ · https://solar.lowtechmagazine.com/ · https://webamp.org/
Tipografia/foundry: https://abcdinamo.com/
Técnica: https://blog.maximeheckel.com/posts/the-art-of-dithering-and-retro-shading-web/ · https://www.ascii-magic.com/
Fontes: Archivo Black · Geist Pixel · IBM VGA (int10h.org/oldschool-pc-fonts/). Averia aposentada.