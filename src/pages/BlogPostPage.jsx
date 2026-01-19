import { useEffect, useRef, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useWordPressPost } from '../hooks/useWordPressPosts'
import blogData from '../data/blog.json'
import './BlogPostPage.css'

gsap.registerPlugin(ScrollTrigger)

// Componente de página individual do post do blog

const BlogPostPage = () => {
  const { slug } = useParams()
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const contentRef = useRef(null)

  // Tentar buscar do WordPress primeiro
  const { post: wpPost, loading: wpLoading } = useWordPressPost(slug)
  
  // Fallback para JSON local se WordPress não tiver o post
  // Buscar no JSON imediatamente (não esperar WordPress)
  const jsonPost = useMemo(() => {
    if (!slug) return null
    
    // Busca exata primeiro
    let found = blogData.posts.find(p => p.slug === slug)
    
    // Se não encontrar, tentar busca case-insensitive
    if (!found) {
      found = blogData.posts.find(p => p.slug?.toLowerCase() === slug?.toLowerCase())
    }
    
    return found || null
  }, [slug])
  
  // Determinar qual post usar e se está carregando
  // PRIORIDADE: WordPress primeiro, depois JSON como fallback
  const post = wpPost || jsonPost
  
  // Só está carregando se está buscando no WordPress E não temos nenhum post ainda
  const loading = wpLoading && !wpPost && !jsonPost

  useEffect(() => {
    if (!post) return

    // Atualizar meta tags
    const metaTitle = post.meta?.title || `${post.title} | Blog botellho.co`
    const metaDescription = post.meta?.description || post.excerpt || ''
    const metaKeywords = post.meta?.keywords || post.tags?.join(', ') || ''

    document.title = metaTitle
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', metaDescription)
    }

    // Keywords
    let metaKeywordsEl = document.querySelector('meta[name="keywords"]')
    if (!metaKeywordsEl) {
      metaKeywordsEl = document.createElement('meta')
      metaKeywordsEl.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywordsEl)
    }
    metaKeywordsEl.setAttribute('content', metaKeywords)

    // Open Graph
    const updateMetaProperty = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    updateMetaProperty('og:title', post.title)
    updateMetaProperty('og:description', post.excerpt)
    updateMetaProperty('og:type', 'article')
    updateMetaProperty('og:url', `https://www.botellho.com/blog/${post.slug}`)

    // Schema.org Article
    const schemaScript = document.createElement('script')
    schemaScript.type = 'application/ld+json'
    schemaScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      author: {
        '@type': 'Organization',
        name: 'botellho.co'
      },
      datePublished: post.date,
      dateModified: post.date,
      publisher: {
        '@type': 'Organization',
        name: 'botellho.co',
        url: 'https://www.botellho.com'
      }
    })
    document.head.appendChild(schemaScript)

    return () => {
      if (document.head.contains(schemaScript)) {
        document.head.removeChild(schemaScript)
      }
    }
  }, [post])

  useEffect(() => {
    if (!sectionRef.current || !post) return

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        )
      }

      if (contentRef.current) {
        const paragraphs = contentRef.current.querySelectorAll('p, h2, h3, ul')
        paragraphs.forEach((el, index) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none',
                once: true,
              },
              delay: index * 0.05,
            }
          )
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [post])

  if (loading) {
    return (
      <div className="blog-post-page blog-post-page-loading">
        <div className="blog-post-container">
          <p>Carregando post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="blog-post-page blog-post-page-error">
        <div className="blog-post-container">
          <h1>Post não encontrado</h1>
          <p>O post com o slug "{slug}" não foi encontrado no WordPress nem no JSON local.</p>
          <Link to="/blog">Voltar para o blog</Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const formatContent = (content) => {
    // Se o conteúdo vier do WordPress, pode vir como HTML
    if (typeof content === 'string' && content.includes('<')) {
      // Se for HTML, retornar como dangerouslySetInnerHTML
      return <div className="blog-post-content-html" dangerouslySetInnerHTML={{ __html: content }} />
    }

    // Se for texto simples (JSON), processar como antes
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="blog-post-content-h2">{paragraph.replace('## ', '')}</h2>
      }
      if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="blog-post-content-h3">{paragraph.replace('### ', '')}</h3>
      }
      if (paragraph.startsWith('- ')) {
        const items = paragraph.split('\n').filter(item => item.startsWith('- '))
        return (
          <ul key={index} className="blog-post-content-list">
            {items.map((item, itemIndex) => (
              <li key={itemIndex}>{item.replace('- ', '')}</li>
            ))}
          </ul>
        )
      }
      return <p key={index} className="blog-post-content-p">{paragraph}</p>
    })
  }

  return (
    <div className="blog-post-page" ref={sectionRef}>
      {/* Header */}
      <section className="blog-post-header" ref={headerRef}>
        <div className="blog-post-container">
          <Link to="/blog" className="blog-post-back">← Voltar para o blog</Link>
          {post.featuredImage && (
            <div className="blog-post-featured-image">
              <img src={post.featuredImage} alt={post.title} />
            </div>
          )}
          <div className="blog-post-header-content">
            <span className="blog-post-category-badge">{post.category}</span>
            <h1 className="blog-post-title">{post.title}</h1>
            <div className="blog-post-meta">
              <span className="blog-post-date">{formatDate(post.date)}</span>
              <span className="blog-post-read-time">• {post.readTime || '1 min'}</span>
              <span className="blog-post-author">• {post.author || 'botellho.co'}</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="blog-post-tags">
                {post.tags.map((tag, index) => (
                  <span key={index} className="blog-post-tag">
                    {typeof tag === 'string' ? tag : tag.name || tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="blog-post-content-wrapper" ref={contentRef}>
        <div className="blog-post-container">
          <div className="blog-post-content">
            {formatContent(post.content)}
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="blog-post-cta">
        <div className="blog-post-container">
          <div className="blog-post-cta-content">
            <h2 className="blog-post-cta-title">Gostou do conteúdo?</h2>
            <p className="blog-post-cta-text">Entre em contato e vamos conversar sobre seu projeto.</p>
            <Link to="/#contact" className="blog-post-cta-button">
              Falar com Especialista
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlogPostPage
