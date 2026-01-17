# botellho.co - Portfolio Website

Site portfolio e prestação de serviços da botellho.co, especializada em desenvolvimento WordPress, plugins e soluções para o terceiro setor.

## 🚀 Tecnologias

- React 18
- Vite
- Framer Motion (animações)
- Lucide React (ícones)
- CSS Modules

## 📦 Instalação

```bash
npm install
```

## 🛠️ Desenvolvimento

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 📤 Deploy para GitHub Pages

```bash
npm run deploy
```

## 🎨 Personalização de Cores

As cores podem ser facilmente alteradas editando as variáveis CSS em `src/styles/variables.css`.

## 🔑 GitHub API Token (Opcional)

Para evitar erros de rate limit (403) ao buscar repositórios do GitHub:

1. Crie um Personal Access Token em: https://github.com/settings/tokens
   - Não precisa de permissões especiais (pode deixar tudo desmarcado)
   - Apenas aumenta o limite de 60 para 5000 requisições/hora

2. Crie um arquivo `.env` na raiz do projeto:
   ```
   VITE_GITHUB_TOKEN=seu_token_aqui
   ```

3. Reinicie o servidor de desenvolvimento

**Nota:** O token é opcional. Sem ele, o site funciona mas pode ter limitações de rate limit.
