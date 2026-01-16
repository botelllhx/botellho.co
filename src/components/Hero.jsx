import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef = useRef(null)
  const parallaxRef = useRef(null)
  const decorativeElementsRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Parallax background - otimizado
      if (parallaxRef.current) {
        gsap.to(parallaxRef.current, {
          yPercent: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      }

      // Split text animation - título com GIF no meio
      if (titleRef.current) {
        // Estrutura já está no HTML, apenas animar os chars
        const chars = titleRef.current?.querySelectorAll('.title-char')
        if (chars && chars.length > 0) {
          gsap.set(chars, { opacity: 0, y: 20 })
          
          requestAnimationFrame(() => {
            setTimeout(() => {
              gsap.to(chars, {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.03,
                ease: 'power4.out',
                delay: 0.3,
              })
            }, 100)
          })
        }
        
        // Animação do GIF estático (fade in)
        const gif = titleRef.current?.querySelector('.hero-title-gif')
        if (gif) {
          gsap.fromTo(
            gif,
            { opacity: 0, scale: 0.8 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: 'power2.out',
              delay: 0.6,
            }
          )
        }
      }

      // Subtitle
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: 1.2,
          }
        )
      }

      // CTAs
      if (ctaRef.current) {
        const ctas = Array.from(ctaRef.current.children || [])
        if (ctas.length > 0) {
          gsap.fromTo(
            ctas,
            {
              opacity: 0,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out',
              delay: 1.6,
            }
          )
        }
      }

      // Elementos decorativos
      if (decorativeElementsRef.current) {
        const elements = Array.from(decorativeElementsRef.current.children || [])
        if (elements.length > 0) {
          gsap.fromTo(
            elements,
            {
              opacity: 0,
              scale: 0.8,
              rotation: -180,
            },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: 'back.out(1.7)',
              delay: 1.8,
            }
          )
        }
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="home" className="hero" ref={sectionRef}>
      {/* Parallax background */}
      <div className="hero-parallax" ref={parallaxRef}>
        <div className="hero-background-pattern"></div>
        <div className="hero-background-lines"></div>
      </div>

      {/* Elementos decorativos */}
      <div className="hero-decorative-elements" ref={decorativeElementsRef}>
        <span className="decorative-char decorative-1">*</span>
        <span className="decorative-char decorative-2">@</span>
        <span className="decorative-char decorative-3">#</span>
        <span className="decorative-char decorative-4">!</span>
      </div>

      <div className="hero-container">
        <div className="hero-content">
              {/* Título principal */}
              <div className="hero-title-wrapper">
                <h1 className="hero-title" ref={titleRef}>
                  <span className="hero-title-before">
                    <span className="title-word">
                      <span className="title-char">D</span>
                      <span className="title-char">E</span>
                      <span className="title-char">S</span>
                      <span className="title-char">E</span>
                      <span className="title-char">N</span>
                      <span className="title-char">V</span>
                      <span className="title-char">O</span>
                      <span className="title-char">L</span>
                      <span className="title-char">V</span>
                      <span className="title-char">I</span>
                      <span className="title-char">M</span>
                      <span className="title-char">E</span>
                      <span className="title-char">N</span>
                      <span className="title-char">T</span>
                      <span className="title-char">O</span>
                    </span>
                    <span className="title-word">
                      <span className="title-char">W</span>
                      <span className="title-char">E</span>
                      <span className="title-char">B</span>
                    </span>
                  </span>
                  <span className="hero-title-gif-wrapper">
                    <img 
                      src="/gifs/hero-logo.gif" 
                      alt="" 
                      className="hero-title-gif" 
                    />
                  </span>
                  <span className="hero-title-after">
                    <span className="title-word">
                      <span className="title-char">C</span>
                      <span className="title-char">O</span>
                      <span className="title-char">M</span>
                    </span>
                    <span className="title-word">
                      <span className="title-char">C</span>
                      <span className="title-char">R</span>
                      <span className="title-char">I</span>
                      <span className="title-char">A</span>
                      <span className="title-char">T</span>
                      <span className="title-char">I</span>
                      <span className="title-char">V</span>
                      <span className="title-char">I</span>
                      <span className="title-char">D</span>
                      <span className="title-char">A</span>
                      <span className="title-char">D</span>
                      <span className="title-char">E</span>
                    </span>
                  </span>
                </h1>
              </div>

          {/* Subtítulo melhorado */}
          <div className="hero-subtitle-wrapper" ref={subtitleRef}>
            <p className="hero-subtitle">
              Transformamos ideias em <strong>experiências digitais</strong> únicas.
              <br />
              Especializados em <strong>WordPress</strong> para museus, faculdades, empresas e startups.
            </p>
          </div>

          {/* CTAs */}
          <div className="hero-cta-wrapper" ref={ctaRef}>
            <a href="#contact" className="cta-primary">
              <span className="cta-text">Começar Projeto</span>
            </a>
            <a href="#services" className="cta-secondary">
              Explorar Serviços
            </a>
          </div>
        </div>
      </div>

      {/* Mini textos decorativos */}
      <div className="hero-mini-texts">
        <span className="mini-text mini-text-1">creative</span>
        <span className="mini-text mini-text-2">code</span>
        <span className="mini-text mini-text-3">design</span>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-line"></div>
        <span className="scroll-text">Scroll</span>
      </div>
    </section>
  )
}

export default Hero
