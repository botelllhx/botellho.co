import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import servicesData from '../data/services.json'
import './ServicePage.css'

gsap.registerPlugin(ScrollTrigger)

const ServicePage = () => {
  const { slug } = useParams()
  const sectionRef = useRef(null)
  const heroRef = useRef(null)
  const contentRef = useRef(null)

  // Buscar serviço pelo slug em vez de pela chave do objeto
  const service = Object.values(servicesData).find(s => s.slug === slug)

  useEffect(() => {
    if (!service) return

    // Atualizar meta tags
    document.title = service.meta.title
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', service.meta.description)
    }

    // Adicionar keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute('content', service.meta.keywords)

    // Schema.org
    const schemaScript = document.createElement('script')
    schemaScript.type = 'application/ld+json'
    schemaScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      description: service.meta.description,
      provider: {
        '@type': 'Organization',
        name: 'botellho.co',
        url: 'https://www.botellho.com'
      }
    })
    document.head.appendChild(schemaScript)

    return () => {
      document.head.removeChild(schemaScript)
    }
  }, [service])

  useEffect(() => {
    if (!sectionRef.current || !service) return

    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        )
      }

      if (contentRef.current) {
        const sections = contentRef.current.querySelectorAll('.service-section')
        sections.forEach((section, index) => {
          gsap.fromTo(
            section,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
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
  }, [service])

  if (!service) {
    return (
      <div className="service-page service-page-error">
        <div className="service-container">
          <h1>Serviço não encontrado</h1>
          <Link to="/">Voltar para a página inicial</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="service-page" ref={sectionRef}>
      {/* Hero Section */}
      <section className="service-hero" ref={heroRef}>
        <div className="service-container">
          <div className="service-hero-content">
            <span className="service-hero-badge">Serviço</span>
            <h1 className="service-hero-title">{service.hero.title}</h1>
            <p className="service-hero-subtitle">{service.hero.subtitle}</p>
            <p className="service-hero-description">{service.hero.description}</p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="service-content" ref={contentRef}>
        <div className="service-container">
          {service.sections.map((section, index) => (
            <section key={index} className="service-section">
              <h2 className="service-section-title">{section.title}</h2>
              <p className="service-section-content">{section.content}</p>
              <ul className="service-section-items">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </section>
          ))}

          {/* Benefits */}
          <section className="service-benefits">
            <h2 className="service-benefits-title">Benefícios</h2>
            <div className="service-benefits-grid">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="service-benefit-card">
                  <h3 className="service-benefit-title">{benefit.title}</h3>
                  <p className="service-benefit-description">{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="service-cta">
            <div className="service-cta-content">
              <p className="service-cta-text">{service.cta.text}</p>
              <Link to="/#contact" className="service-cta-button">
                {service.cta.button}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ServicePage
