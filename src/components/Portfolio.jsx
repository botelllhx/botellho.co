import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TypingText from './TypingText'
import './Portfolio.css'

gsap.registerPlugin(ScrollTrigger)

const Portfolio = () => {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef(null)
  const parallaxRef = useRef(null)

  const projects = [
    {
      title: 'Sistema de Gestão',
      description: 'Plataforma WordPress completa para gestão de instituições',
      category: 'Institucional',
    },
    {
      title: 'E-commerce',
      description: 'Loja virtual com WooCommerce e integrações avançadas',
      category: 'E-commerce',
    },
    {
      title: 'Plugin Doações',
      description: 'Sistema de captação com múltiplos gateways de pagamento',
      category: 'WordPress',
    },
    {
      title: 'Site Institucional',
      description: 'Design moderno e responsivo em React e TypeScript',
      category: 'Web',
    },
    {
      title: 'Sistema de Eventos',
      description: 'Gestão completa com certificados automáticos e relatórios',
      category: 'Institucional',
    },
    {
      title: 'Dashboard Analytics',
      description: 'Visualizações em tempo real e relatórios personalizados',
      category: 'Web',
    },
  ]

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
            <span className="title-number">03</span>
            <span className="title-main">PORTFÓLIO</span>
          </h2>
        </div>

        {/* Grid limpo - Sem deslocamentos */}
        <div className="portfolio-grid" ref={cardsRef}>
          {projects.map((project, index) => (
            <div key={index} className="portfolio-card">
              <div className="portfolio-card-image"></div>
              <div className="portfolio-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="portfolio-card-content">
                <div className="portfolio-card-header">
                  <span className="portfolio-category">{project.category}</span>
                </div>
                <h3 className="portfolio-card-title">{project.title}</h3>
                <p className="portfolio-card-description">{project.description}</p>
                <div className="portfolio-link">
                  <span>Ver Detalhes</span>
                  <div className="portfolio-link-underline"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Texto com typing integrado */}
      <TypingText
        text="design que transforma"
        gifSrc="/gifs/design.gif"
        className="portfolio-typing"
      />
    </section>
  )
}

export default Portfolio
