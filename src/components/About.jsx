import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './About.css'

gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const contentRef = useRef(null)
  const valuesRef = useRef(null)
  const parallaxRef = useRef(null)

  const values = [
    {
      title: 'Resultados',
      description: 'Foco em impacto mensurável e transformação real para cada cliente',
    },
    {
      title: 'Tecnologia',
      description: 'Práticas modernas e ferramentas de ponta para soluções robustas',
    },
    {
      title: 'Criatividade',
      description: 'Soluções únicas e inovadoras que destacam seu projeto',
    },
    {
      title: 'Qualidade',
      description: 'Código limpo, documentado e manutenível para longo prazo',
    },
  ]

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Parallax background
      if (parallaxRef.current) {
        gsap.to(parallaxRef.current, {
          yPercent: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }

      // Animações só de entrada (once: true)
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            x: -50,
          },
          {
            opacity: 1,
            x: 0,
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

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
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
              trigger: contentRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        )
      }

      const values = valuesRef.current ? Array.from(valuesRef.current.children || []) : []
      if (values.length > 0) {
        gsap.fromTo(
          values,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: valuesRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="about section" ref={sectionRef}>
      {/* Parallax background */}
      <div className="about-parallax" ref={parallaxRef}>
        <div className="about-background-pattern"></div>
        <div className="about-background-lines"></div>
      </div>

      <div className="about-container">
        {/* Título */}
        <div className="about-title-block">
          <h2 className="about-title" ref={titleRef}>
            <span className="title-number">02</span>
            <span className="title-main">SOBRE</span>
          </h2>
        </div>

        {/* Layout 2 colunas: Conteúdo à esquerda, Valores à direita */}
        <div className="about-layout">
          {/* Conteúdo principal - Esquerda */}
          <div className="about-content-block" ref={contentRef}>
            <h3 className="about-heading">
              Transformando ideias em <span className="text-underline">realidade digital</span>
            </h3>
            <div className="about-text">
              <p>
                A <strong>botellho.co</strong> nasceu com o propósito de democratizar o acesso à
                tecnologia de qualidade. Acreditamos que toda organização, independente do tamanho
                ou segmento, merece ter uma presença digital profissional e eficiente.
              </p>
              <p>
                Com foco especializado em <strong>WordPress</strong> e{' '}
                <strong>liberdade criativa</strong>, desenvolvemos sites, sistemas e plugins que não
                apenas funcionam, mas que realmente fazem a diferença para museus, faculdades,
                empresas e startups.
              </p>
            </div>
          </div>

          {/* Valores - Direita */}
          <div className="about-values-block" ref={valuesRef}>
            {values.map((value, index) => (
              <div key={index} className="value-item">
                <div className="value-number">{String(index + 1).padStart(2, '0')}</div>
                <div className="value-content">
                  <h4 className="value-title">{value.title}</h4>
                  <p className="value-description">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
