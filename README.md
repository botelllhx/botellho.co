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

O deploy e feito automaticamente pelo GitHub Actions quando ha push/merge na branch `main`.

- Branch de origem: `main`
- Branch de publicacao: `gh-pages`
- Workflow: `.github/workflows/deploy.yml`

## 🌿 Convencao de Branches

- `main`: branch unica de integracao e producao (cada merge pode disparar deploy)
- `feature/<escopo-curto>`: novas funcionalidades
- `hotfix/<escopo-curto>`: correcoes urgentes de producao
- `chore/<escopo-curto>`: manutencao tecnica (deps, CI, lint, docs de infra)
- `gh-pages`: branch tecnica de artefato; nao receber commits manuais

## 🔀 Fluxo de PR e Merge

1. Crie uma branch a partir de `main` (`feature/*`, `hotfix/*` ou `chore/*`)
2. Abra PR para `main`
3. Garanta checks obrigatorios passando (build/test/lint)
4. Use merge por squash para manter historico limpo
5. Apague a branch de trabalho apos merge

## ✅ Checklist de protecao da main (GitHub Settings)

- Exigir pull request antes de merge
- Exigir status checks obrigatorios
- Bloquear push direto para `main`
- Exigir branch atualizada antes do merge
- Restringir quem pode dar bypass nas regras (apenas administradores, se necessario)

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
