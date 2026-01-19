import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useWordPressPosts, useWordPressCategories } from '../hooks/useWordPressPosts'
import blogData from '../data/blog.json'
import './BlogPage.css'

gsap.registerPlugin(ScrollTrigger)

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const postsRef = useRef(null)

  // Tentar buscar do WordPress primeiro
  const { posts: wpPosts, loading: wpLoading, error: wpError } = useWordPressPosts({
    perPage: 20,
    category: selectedCategory !== 'all' ? selectedCategory : null,
  })

  const { categories: wpCategories, loading: categoriesLoading } = useWordPressCategories()

  // Fallback para JSON local se WordPress falhar ou não tiver posts
  // Usar WordPress apenas se não houver erro E tiver posts
  const useWordPress = !wpError && wpPosts && wpPosts.length > 0 && !wpLoading
  const posts = useWordPress ? wpPosts : blogData.posts
  const categories = useWordPress && wpCategories && wpCategories.length > 0 ? wpCategories : blogData.categories
  const loading = (wpLoading || categoriesLoading) && !useWordPress

  useEffect(() => {
    // Atualizar meta tags
    document.title = 'Blog | botellho.co - Desenvolvimento Web, WordPress e UX/UI Design'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Artigos sobre desenvolvimento WordPress, UX/UI Design, SEO técnico e boas práticas de desenvolvimento web. Conteúdo especializado para profissionais e empresas.')
    }
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        )
      }

      if (postsRef.current) {
        const cards = postsRef.current.querySelectorAll('.blog-post-card')
        cards.forEach((card, index) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none',
                once: true,
              },
              delay: index * 0.1,
            }
          )
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [selectedCategory])

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => {
        const postCategory = useWordPress ? post.categorySlug : post.category.toLowerCase()
        return postCategory === selectedCategory.toLowerCase()
      })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="blog-page" ref={sectionRef}>
      {/* Header */}
      <section className="blog-header" ref={headerRef}>
        <div className="blog-container">
          <div className="blog-header-content">
            <span className="blog-header-badge">Blog</span>
            <h1 className="blog-header-title">Conteúdo Especializado</h1>
            <p className="blog-header-subtitle">
              Artigos sobre desenvolvimento WordPress, UX/UI Design, SEO técnico e boas práticas de desenvolvimento web.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="blog-categories">
        <div className="blog-container">
          <div className="blog-categories-list">
            <button
              className={`blog-category-button ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              Todos
            </button>
            {categories.map((category) => {
              const categorySlug = useWordPress ? category.slug : category.slug
              const categoryName = useWordPress ? category.name : category.name
              return (
                <button
                  key={categorySlug}
                  className={`blog-category-button ${selectedCategory === categorySlug ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(categorySlug)}
                >
                  {categoryName}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Posts Grid - Estilo NY Times Moderno */}
      <section className="blog-posts" ref={postsRef}>
        <div className="blog-container">
          {loading && filteredPosts.length === 0 ? (
            <div className="blog-loading">
              <p>Carregando posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="blog-empty">
              <p>Nenhum post encontrado nesta categoria.</p>
            </div>
          ) : (
            <div className="blog-posts-grid">
              {filteredPosts.map((post, index) => (
                <article key={post.id} className={`blog-post-card ${index === 0 ? 'featured' : ''}`}>
                  <Link to={`/blog/${post.slug}`} className="blog-post-link">
                    <div className="blog-post-image-wrapper">
                      {post.featuredImage ? (
                        <img 
                          src={post.featuredImage} 
                          alt={post.title}
                          className="blog-post-image"
                        />
                      ) : (
                        <div className="blog-post-image-placeholder">
                          <span className="blog-post-category">
                            {useWordPress ? post.category : post.category}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="blog-post-content">
                      <div className="blog-post-meta">
                        <span className="blog-post-date">{formatDate(post.date)}</span>
                        <span className="blog-post-read-time">• {post.readTime || '1 min'}</span>
                      </div>
                      <h2 className="blog-post-title">{post.title}</h2>
                      {index === 0 && post.excerpt && (
                        <p className="blog-post-excerpt">{post.excerpt}</p>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="blog-post-tags">
                          {post.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span key={tagIndex} className="blog-post-tag">
                              {typeof tag === 'string' ? tag : tag.name || tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default BlogPage
