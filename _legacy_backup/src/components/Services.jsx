import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TypingText from './TypingText'
import { useTexts } from '../hooks/useTexts'
import './Services.css'

gsap.registerPlugin(ScrollTrigger)

const Services = () => {
  const { texts } = useTexts()
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const gridRef = useRef(null)
  const parallaxRef = useRef(null)

  const servicesTexts = texts.services
  const services = servicesTexts.items

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Parallax background
      if (parallaxRef.current) {
        gsap.to(parallaxRef.current, {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }

      // Título
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

      // Grid items - Layout diferente
      const items = gridRef.current ? Array.from(gridRef.current.children || []) : []
      if (items.length > 0) {
        items.forEach((item, index) => {
          gsap.fromTo(
            item,
            {
              opacity: 0,
              scale: 0.8,
              y: 60,
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
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
    <section id="services" className="services section" ref={sectionRef}>
      {/* Parallax background */}
      <div className="services-parallax" ref={parallaxRef}>
        <div className="services-background-pattern"></div>
        <div className="services-background-lines"></div>
      </div>

      <div className="services-container">
        <div className="services-header">
          <h2 className="services-title" ref={titleRef}>
            <span className="title-number">{servicesTexts.title.number}</span>
            <span className="title-main">{servicesTexts.title.main}</span>
          </h2>
        </div>

        {/* Grid 2 colunas - Layout diferente de About */}
        <div className="services-grid" ref={gridRef}>
          {services.map((service, index) => (
            <Link 
              key={index} 
              to={`/services/${service.slug || service.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="service-card"
            >
              <div className="service-card-number">{service.number}</div>
              <div className="service-card-content">
                <h3 className="service-card-title">{service.title}</h3>
                <p className="service-card-description">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Texto com typing integrado */}
      <TypingText
        text={servicesTexts.typingText}
        gifSrc="/gifs/code.gif"
        className="services-typing"
      />
    </section>
  )
}

export default Services
