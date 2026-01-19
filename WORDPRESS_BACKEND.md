# Integração WordPress como Backend para o Blog

Este guia explica como integrar WordPress como backend (headless CMS) para alimentar o blog do site botellho.co, mantendo o frontend React atual.

## 📋 Visão Geral

A ideia é usar WordPress apenas como CMS (Content Management System) para gerenciar posts do blog, enquanto o frontend React continua sendo servido estaticamente. Isso oferece:

- ✅ Interface familiar do WordPress para escrever posts
- ✅ Gerenciamento de categorias, tags, mídia
- ✅ SEO nativo do WordPress
- ✅ Frontend React mantido (performance, animações, identidade visual)
- ✅ Headless WordPress (REST API)

## 🏗️ Arquitetura

```
WordPress (Backend) → REST API → React Frontend (GitHub Pages)
     ↓
  Admin WordPress
  (Gerenciar posts)
```

## 📦 Opções de Implementação

### Opção 1: WordPress.com (Mais Simples)

**Vantagens:**
- Setup rápido
- Sem necessidade de servidor próprio
- HTTPS e segurança incluídos
- Planos gratuitos disponíveis

**Passos:**
1. Criar conta em wordpress.com
2. Criar site (pode ser privado)
3. Usar REST API: `https://seusite.wordpress.com/wp-json/wp/v2/posts`

### Opção 2: WordPress Self-Hosted (Mais Controle)

**Vantagens:**
- Controle total
- Plugins customizados
- Custom Post Types
- Mais flexibilidade

**Requisitos:**
- Servidor com PHP e MySQL
- Domínio (opcional)
- Instalação WordPress

## 🔧 Implementação Técnica

### 1. Configurar WordPress REST API

No WordPress, a REST API já vem habilitada por padrão. Endpoints disponíveis:

- Posts: `/wp-json/wp/v2/posts`
- Categorias: `/wp-json/wp/v2/categories`
- Tags: `/wp-json/wp/v2/tags`
- Mídia: `/wp-json/wp/v2/media`

### 2. Criar Hook para Buscar Posts do WordPress

Crie um novo hook `useWordPressPosts.js`:

```javascript
// src/hooks/useWordPressPosts.js
import { useState, useEffect } from 'react'

const WORDPRESS_API_URL = import.meta.env.VITE_WORDPRESS_API_URL || 'https://seusite.wordpress.com/wp-json/wp/v2'

export const useWordPressPosts = (options = {}) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams({
          per_page: options.perPage || 10,
          _embed: 'true', // Inclui featured image e author
          ...options.params
        })

        if (options.category) {
          params.append('categories', options.category)
        }

        const response = await fetch(`${WORDPRESS_API_URL}/posts?${params}`)
        
        if (!response.ok) {
          throw new Error(`WordPress API error: ${response.status}`)
        }

        const data = await response.json()

        // Transformar dados do WordPress para formato do blog
        const transformedPosts = data.map(post => ({
          id: post.id.toString(),
          slug: post.slug,
          title: post.title.rendered,
          excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 200),
          content: post.content.rendered,
          author: post._embedded?.author?.[0]?.name || 'botellho.co',
          date: post.date,
          category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Geral',
          tags: post._embedded?.['wp:term']?.[1]?.map(tag => tag.name) || [],
          image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
          readTime: calculateReadTime(post.content.rendered),
          meta: {
            title: `${post.title.rendered} | Blog botellho.co`,
            description: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
            keywords: post._embedded?.['wp:term']?.[1]?.map(tag => tag.name).join(', ') || ''
          }
        }))

        setPosts(transformedPosts)
      } catch (err) {
        console.error('Error fetching WordPress posts:', err)
        setError(err.message)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [options.category, options.perPage])

  return { posts, loading, error }
}

function calculateReadTime(content) {
  const text = content.replace(/<[^>]*>/g, '')
  const words = text.split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} min`
}

export default useWordPressPosts
```

### 3. Atualizar BlogPage para Usar WordPress

```javascript
// src/pages/BlogPage.jsx
import { useWordPressPosts } from '../hooks/useWordPressPosts'

const BlogPage = () => {
  const { posts, loading, error } = useWordPressPosts({
    perPage: 12
  })

  // ... resto do código
}
```

### 4. Variáveis de Ambiente

Adicione no `.env`:

```env
VITE_WORDPRESS_API_URL=https://seusite.wordpress.com/wp-json/wp/v2
```

## 🎨 Customizações do WordPress

### Custom Post Type (Opcional)

Se quiser posts específicos para o blog, crie um Custom Post Type:

```php
// functions.php do WordPress
function create_blog_post_type() {
    register_post_type('blog_post',
        array(
            'labels' => array(
                'name' => 'Blog Posts',
                'singular_name' => 'Blog Post'
            ),
            'public' => true,
            'show_in_rest' => true, // Importante para REST API
            'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'categories', 'tags')
        )
    );
}
add_action('init', 'create_blog_post_type');
```

### Campos Customizados (ACF ou Meta Boxes)

Para campos adicionais como "readTime", use Advanced Custom Fields (ACF) ou meta boxes nativos.

## 🔄 Estratégias de Cache

### 1. Cache no Frontend (Recomendado)

```javascript
// Cache posts por 1 hora
const CACHE_KEY = 'wordpress_posts'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hora

const getCachedPosts = () => {
  const cached = localStorage.getItem(CACHE_KEY)
  if (cached) {
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data
    }
  }
  return null
}

const setCachedPosts = (posts) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data: posts,
    timestamp: Date.now()
  }))
}
```

### 2. Build Time Generation (ISR - Incremental Static Regeneration)

Para sites estáticos, você pode gerar posts no build time:

```javascript
// scripts/generate-blog.js
import fetch from 'node-fetch'

async function generateBlogPosts() {
  const response = await fetch('https://seusite.wordpress.com/wp-json/wp/v2/posts')
  const posts = await response.json()
  
  // Salvar em blog.json
  fs.writeFileSync('src/data/blog.json', JSON.stringify({ posts }, null, 2))
}
```

Execute antes do build:
```json
{
  "scripts": {
    "prebuild": "node scripts/generate-blog.js",
    "build": "vite build"
  }
}
```

## 🚀 Deploy e Atualização

### Opção A: Build Time (Recomendado para GitHub Pages)

1. WordPress atualiza posts
2. GitHub Action ou script local busca posts
3. Gera `blog.json` atualizado
4. Build e deploy

### Opção B: Runtime (Requer servidor)

1. Frontend busca posts em tempo real
2. Cache no cliente
3. Atualização automática

## 📝 Exemplo de GitHub Action

```yaml
# .github/workflows/update-blog.yml
name: Update Blog Posts

on:
  schedule:
    - cron: '0 */6 * * *' # A cada 6 horas
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: node scripts/generate-blog.js
      - run: git add src/data/blog.json
      - run: git commit -m "Update blog posts" || exit 0
      - run: git push
```

## 🔐 Segurança

### CORS

Se WordPress estiver em domínio diferente, configure CORS:

```php
// functions.php
function add_cors_headers() {
    header('Access-Control-Allow-Origin: https://www.botellho.com');
    header('Access-Control-Allow-Methods: GET');
}
add_action('init', 'add_cors_headers');
```

### Rate Limiting

WordPress.com tem rate limits. Considere:
- Cache agressivo
- Build time generation
- Token de autenticação (se necessário)

## 🎯 Próximos Passos

1. **Escolher opção**: WordPress.com ou self-hosted
2. **Configurar WordPress**: Criar site, configurar permalinks
3. **Testar API**: Verificar endpoints REST
4. **Implementar hook**: Criar `useWordPressPosts`
5. **Atualizar componentes**: Integrar com BlogPage
6. **Configurar cache**: Implementar estratégia de cache
7. **Automatizar**: GitHub Actions ou script local

## 📚 Recursos

- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [WordPress.com REST API](https://developer.wordpress.com/docs/api/)
- [Headless WordPress Guide](https://www.wpbeginner.com/wp-tutorials/how-to-use-wordpress-as-headless-cms/)

## 💡 Dica

Para começar rápido, use WordPress.com com plano gratuito. Depois, se precisar de mais controle, migre para self-hosted.
