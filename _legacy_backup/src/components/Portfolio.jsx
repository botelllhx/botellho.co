import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TypingText from './TypingText'
import { useTexts } from '../hooks/useTexts'
import { useGitHubRepos } from '../hooks/useGitHubRepos'
import './Portfolio.css'

gsap.registerPlugin(ScrollTrigger)

const Portfolio = () => {
  const { texts } = useTexts()
  const { repos, loading, error } = useGitHubRepos('botelllhx') // Substitua pelo seu username do GitHub
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef(null)
  const parallaxRef = useRef(null)

  const portfolioTexts = texts.portfolio

  // Usar repositórios do GitHub ou projetos padrão
  const projects = repos.length > 0 
    ? repos.map((repo, index) => ({
        title: repo.name
          .replace(/-/g, ' ')
          .replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase()),
        description: repo.description || portfolioTexts.projects[index]?.description || 'Projeto desenvolvido com tecnologias modernas',
        category: repo.category || 'Web', // Usa a categoria determinada pelo hook
        url: repo.url,
        homepage: repo.homepage,
        stars: repo.stars,
        forks: repo.forks,
      }))
    : portfolioTexts.projects

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Parallax background
      if (parallaxRef.current) {
        gsap.to(parallaxRef.current, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }

      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        )
      }

      // Cards - Grid limpo sem deslocamentos
      const cards = cardsRef.current ? Array.from(cardsRef.current.children || []) : []
      if (cards.length > 0) {
        cards.forEach((card, index) => {
          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 60,
            },
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
  }, [])

  return (
    <section id="portfolio" className="portfolio section" ref={sectionRef}>
      {/* Parallax background */}
      <div className="portfolio-parallax" ref={parallaxRef}>
        <div className="portfolio-background-pattern"></div>
        <div className="portfolio-background-lines"></div>
      </div>

      <div className="portfolio-container">
        <div className="portfolio-header">
          <h2 className="portfolio-title" ref={titleRef}>
            <span className="title-number">{portfolioTexts.title.number}</span>
            <span className="title-main">{portfolioTexts.title.main}</span>
          </h2>
        </div>

        {/* Grid limpo - Sem deslocamentos */}
        {loading ? (
          <div className="portfolio-loading">
            <p>Carregando projetos...</p>
          </div>
        ) : error ? (
          <div className="portfolio-error">
            <p>Erro ao carregar projetos do GitHub: {error}</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
              Exibindo projetos padrão. Para resolver, crie um token do GitHub em{' '}
              <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                github.com/settings/tokens
              </a>
              {' '}e adicione como VITE_GITHUB_TOKEN no arquivo .env
            </p>
          </div>
        ) : (
          <div className="portfolio-grid" ref={cardsRef}>
            {projects.map((project, index) => (
              <div key={index} className="portfolio-card">
                <div className="portfolio-card-image"></div>
                <div className="portfolio-number">{String(index + 1).padStart(2, '0')}</div>
                <div className="portfolio-card-content">
                  <div className="portfolio-card-header">
                    <span className="portfolio-category">{project.category}</span>
                    {project.stars !== undefined && (
                      <span className="portfolio-stats">
                        ⭐ {project.stars} {project.forks > 0 && `| 🍴 ${project.forks}`}
                      </span>
                    )}
                  </div>
                  <h3 className="portfolio-card-title">{project.title}</h3>
                  <p className="portfolio-card-description">{project.description}</p>
                  <a 
                    href={project.url || project.homepage || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="portfolio-link"
                  >
                    <span>{portfolioTexts.linkText}</span>
                    <div className="portfolio-link-underline"></div>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Texto com typing integrado */}
      <TypingText
        text={portfolioTexts.typingText}
        gifSrc="/gifs/design.gif"
        className="portfolio-typing"
      />
    </section>
  )
}

export default Portfolio
