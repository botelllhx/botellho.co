# 🚀 Guia de Deploy para GitHub Pages

## Configuração Inicial

1. **Ajuste o base path no `vite.config.js`**
   - Se seu repositório for `https://github.com/seu-usuario/botellho`, mantenha `base: '/botellho/'`
   - Se for o repositório raiz do usuário (ex: `https://github.com/seu-usuario/seu-usuario.github.io`), altere para `base: '/'`

2. **Instale as dependências:**
   ```bash
   npm install
   ```

## Deploy Manual

### Opção 1: Usando gh-pages (Recomendado)

```bash
npm run deploy
```

Isso irá:
- Fazer o build do projeto
- Publicar na branch `gh-pages` do seu repositório

### Opção 2: Usando GitHub Actions

O arquivo `.github/workflows/deploy.yml` já está configurado. Basta fazer push para a branch `main`:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

O GitHub Actions irá automaticamente fazer o build e deploy.

## Configuração no GitHub

1. Vá em **Settings** > **Pages** do seu repositório
2. Selecione a branch `gh-pages` como source
3. Aguarde alguns minutos e seu site estará disponível em:
   - `https://seu-usuario.github.io/botellho/` (se base for `/botellho/`)
   - `https://seu-usuario.github.io/` (se base for `/`)

## Personalização de Cores

Para alterar a paleta de cores, edite o arquivo `src/styles/variables.css` e descomente uma das opções de cores alternativas ou crie sua própria paleta.
