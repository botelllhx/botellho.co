import { useState, useEffect } from 'react'

/**
 * Hook para buscar posts do WordPress.com
 * 
 * WordPress.com REST API endpoint:
 * https://public-api.wordpress.com/rest/v1.1/sites/{site}/posts/
 * 
 * Para sites privados, você precisará de autenticação ou tornar o site público
 */
const WORDPRESS_SITE = 'botellhocomblog.wordpress.com'
const WORDPRESS_API_URL = `https://public-api.wordpress.com/rest/v1.1/sites/${WORDPRESS_SITE}/posts/`

export const useWordPressPosts = (options = {}) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const {
    perPage = 10,
    category = null,
    search = null,
    orderBy = 'date',
    order = 'desc',
  } = options

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError(null)

      try {
        // Construir URL com parâmetros
        const params = new URLSearchParams({
          number: perPage.toString(),
          order_by: orderBy,
          order: order,
        })

        if (category) {
          params.append('category', category)
        }

        if (search) {
          params.append('search', search)
        }

        const url = `${WORDPRESS_API_URL}?${params.toString()}`

        const response = await fetch(url)

        if (!response.ok) {
          // Se o site for privado, retornar erro específico
          if (response.status === 403 || response.status === 401) {
            throw new Error(
              'Site WordPress está privado. Torne o site público ou configure autenticação.'
            )
          }
          throw new Error(`Erro ao buscar posts: ${response.statusText}`)
        }

        const data = await response.json()

        // Transformar dados do WordPress para o formato esperado
        const transformedPosts = data.posts?.map((post) => {
          // Extrair excerpt (pode vir como objeto ou string)
          let excerpt = ''
          if (typeof post.excerpt === 'string') {
            excerpt = post.excerpt.replace(/<[^>]*>/g, '').substring(0, 200)
          } else if (post.excerpt?.rendered) {
            excerpt = post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 200)
          }

          // Extrair título (pode vir como objeto ou string)
          let title = ''
          if (typeof post.title === 'string') {
            title = post.title
          } else if (post.title?.rendered) {
            title = post.title.rendered
          }

          // Extrair conteúdo (pode vir como objeto ou string)
          let content = ''
          if (typeof post.content === 'string') {
            content = post.content
          } else if (post.content?.rendered) {
            content = post.content.rendered
          }

          // Processar tags - pode vir como array, objeto ou string
          let tags = []
          if (Array.isArray(post.tags)) {
            tags = post.tags.map((tag) => (typeof tag === 'string' ? tag : tag.name || tag))
          } else if (post.tags && typeof post.tags === 'object') {
            // Se for objeto, tentar extrair valores
            tags = Object.values(post.tags).map((tag) => (typeof tag === 'string' ? tag : tag.name || tag))
          } else if (typeof post.tags === 'string') {
            tags = [post.tags]
          }

          // Processar keywords para meta
          const keywords = tags.length > 0 ? tags.join(', ') : ''

          return {
            id: post.ID?.toString() || post.id?.toString() || String(Math.random()),
            slug: post.slug,
            title: title,
            excerpt: excerpt,
            content: content,
            date: post.date,
            modified: post.modified || post.date,
            author: post.author?.name || 'botellho.co',
            category: post.categories?.[0]?.name || post.category || 'Geral',
            categorySlug: post.categories?.[0]?.slug || 'geral',
            tags: tags,
            featuredImage: post.featured_image || post.featured_media_url || null,
            readTime: calculateReadTime(content),
            link: post.URL || post.link || null,
            meta: {
              title: `${title} | Blog botellho.co`,
              description: excerpt,
              keywords: keywords,
            },
          }
        }) || []

        setPosts(transformedPosts)
      } catch (err) {
        console.error('Erro ao buscar posts do WordPress:', err)
        setError(err.message)
        setPosts([]) // Retornar array vazio em caso de erro
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [perPage, category, search, orderBy, order])

  return { posts, loading, error }
}

/**
 * Hook para buscar um post específico por slug
 */
export const useWordPressPost = (slug) => {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      setPost(null)
      return
    }

    const fetchPost = async () => {
      setLoading(true)
      setError(null)
      setPost(null) // Reset post antes de buscar

      try {
        // WordPress.com API não suporta busca direta por slug
        // Buscar todos os posts e filtrar pelo slug
        const url = `${WORDPRESS_API_URL}?number=100`

        const response = await fetch(url)

        if (!response.ok) {
          // Se for 403/401, site privado - usar fallback silenciosamente
          if (response.status === 403 || response.status === 401) {
            setPost(null)
            setError(null)
            setLoading(false)
            return
          }
          // Outros erros - usar fallback silenciosamente
          setPost(null)
          setError(null)
          setLoading(false)
          return
        }

        const data = await response.json()

        // Filtrar posts pelo slug
        let wpPost = null
        if (data.posts && Array.isArray(data.posts)) {
          wpPost = data.posts.find(p => {
            const postSlug = p.slug || ''
            return postSlug.toLowerCase() === slug.toLowerCase()
          })
        }

        if (wpPost) {
          
          // Extrair excerpt
          let excerpt = ''
          if (typeof wpPost.excerpt === 'string') {
            excerpt = wpPost.excerpt.replace(/<[^>]*>/g, '').substring(0, 200)
          } else if (wpPost.excerpt?.rendered) {
            excerpt = wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 200)
          }

          // Extrair título
          let title = ''
          if (typeof wpPost.title === 'string') {
            title = wpPost.title
          } else if (wpPost.title?.rendered) {
            title = wpPost.title.rendered
          }

          // Extrair conteúdo
          let content = ''
          if (typeof wpPost.content === 'string') {
            content = wpPost.content
          } else if (wpPost.content?.rendered) {
            content = wpPost.content.rendered
          }

          // Processar tags - pode vir como array, objeto ou string
          let tags = []
          if (Array.isArray(wpPost.tags)) {
            tags = wpPost.tags.map((tag) => (typeof tag === 'string' ? tag : tag.name || tag))
          } else if (wpPost.tags && typeof wpPost.tags === 'object') {
            // Se for objeto, tentar extrair valores
            tags = Object.values(wpPost.tags).map((tag) => (typeof tag === 'string' ? tag : tag.name || tag))
          } else if (typeof wpPost.tags === 'string') {
            tags = [wpPost.tags]
          }

          // Processar keywords para meta
          const keywords = tags.length > 0 ? tags.join(', ') : ''

          const transformedPost = {
            id: wpPost.ID?.toString() || wpPost.id?.toString() || String(Math.random()),
            slug: wpPost.slug,
            title: title,
            excerpt: excerpt,
            content: content,
            date: wpPost.date,
            modified: wpPost.modified || wpPost.date,
            author: wpPost.author?.name || 'botellho.co',
            category: wpPost.categories?.[0]?.name || wpPost.category || 'Geral',
            categorySlug: wpPost.categories?.[0]?.slug || 'geral',
            tags: tags,
            featuredImage: wpPost.featured_image || wpPost.featured_media_url || null,
            readTime: calculateReadTime(content),
            link: wpPost.URL || wpPost.link || null,
            meta: {
              title: `${title} | Blog botellho.co`,
              description: excerpt,
              keywords: keywords,
            },
          }
          setPost(transformedPost)
        } else {
          // Post não encontrado no WordPress - usar fallback do JSON
          setPost(null)
          setError(null)
        }
      } catch (err) {
        // Erro de rede ou outro erro - usar fallback silenciosamente
        console.warn('Não foi possível buscar post do WordPress, usando fallback:', err.message)
        setPost(null)
        setError(null) // Não definir erro para permitir fallback
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  return { post, loading, error }
}

/**
 * Calcular tempo de leitura baseado no conteúdo
 */
function calculateReadTime(content) {
  if (!content) return '1 min'
  
  // Remover HTML tags
  const text = content.replace(/<[^>]*>/g, '')
  // Contar palavras (aproximadamente)
  const words = text.split(/\s+/).length
  // Média de leitura: 200 palavras por minuto
  const minutes = Math.ceil(words / 200)
  
  return `${minutes} min`
}

/**
 * Hook para buscar categorias do WordPress
 */
export const useWordPressCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      setError(null)

      try {
        const url = `https://public-api.wordpress.com/rest/v1.1/sites/${WORDPRESS_SITE}/categories/`

        const response = await fetch(url)

        if (!response.ok) {
          if (response.status === 403 || response.status === 401) {
            throw new Error(
              'Site WordPress está privado. Torne o site público ou configure autenticação.'
            )
          }
          throw new Error(`Erro ao buscar categorias: ${response.statusText}`)
        }

        const data = await response.json()

        const transformedCategories =
          data.categories?.map((cat) => ({
            id: cat.ID,
            name: cat.name,
            slug: cat.slug,
            description: cat.description || '',
            count: cat.post_count || 0,
          })) || []

        setCategories(transformedCategories)
      } catch (err) {
        console.error('Erro ao buscar categorias do WordPress:', err)
        setError(err.message)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}
