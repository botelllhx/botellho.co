import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTexts } from '../hooks/useTexts'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const { texts } = useTexts()
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef = useRef(null)
  const parallaxRef = useRef(null)
  const decorativeElementsRef = useRef(null)
  
  // Fallback caso texts ainda não esteja carregado
  const heroTexts = texts?.hero || {
    title: { before: 'DESENVOLVIMENTO WEB', after: 'COM CRIATIVIDADE' },
    subtitle: { line1: 'Transformamos ideias em', line1Strong: 'experiências digitais', line1Strong2: 'únicas', line2: 'Especializados em', line2Strong: 'WordPress', line2Rest: 'para museus, faculdades, empresas e startups.' },
    cta: { primary: 'Começar Projeto', secondary: 'Explorar Serviços' },
    decorative: { chars: ['*', '@', '#', '!'], miniTexts: ['creative', 'code', 'design'] },
    scroll: 'Scroll'
  }

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
        {(heroTexts.decorative?.chars || ['*', '@', '#', '!']).map((char, index) => (
          <span key={index} className={`decorative-char decorative-${index + 1}`}>
            {char}
          </span>
        ))}
      </div>

      <div className="hero-container">
        <div className="hero-content">
              {/* Título principal */}
              <div className="hero-title-wrapper">
                <h1 className="hero-title" ref={titleRef}>
                  <span className="hero-title-before">
                    {(heroTexts.title?.before || 'DESENVOLVIMENTO WEB').split(' ').map((word, wordIndex) => {
                      // Variação de fonte: alternar entre serif e display
                      const fontVariation = wordIndex % 3 === 0 ? 'serif' : wordIndex % 3 === 1 ? 'display' : 'accent'
                      return (
                        <span key={wordIndex} className={`title-word title-word-${fontVariation}`}>
                          {word.split('').map((char, charIndex) => (
                            <span key={charIndex} className="title-char">
                              {char}
                            </span>
                          ))}
                        </span>
                      )
                    })}
                  </span>
                  <span className="hero-title-gif-wrapper">
                    <img 
                      src="/gifs/hero-logo.gif" 
                      alt="" 
                      className="hero-title-gif" 
                    />
                  </span>
                  <span className="hero-title-after">
                    {(heroTexts.title?.after || 'COM CRIATIVIDADE').split(' ').map((word, wordIndex) => {
                      // Variação de fonte: alternar entre serif e display
                      const fontVariation = wordIndex % 3 === 0 ? 'display' : wordIndex % 3 === 1 ? 'accent' : 'serif'
                      return (
                        <span key={wordIndex} className={`title-word title-word-${fontVariation}`}>
                          {word.split('').map((char, charIndex) => (
                            <span key={charIndex} className="title-char">
                              {char}
                            </span>
                          ))}
                        </span>
                      )
                    })}
                  </span>
                </h1>
              </div>

          {/* Subtítulo melhorado */}
          <div className="hero-subtitle-wrapper" ref={subtitleRef}>
            <p className="hero-subtitle">
              {heroTexts.subtitle?.line1 || 'Criamos'} <strong>{heroTexts.subtitle?.line1Strong || 'produtos digitais'}</strong> {heroTexts.subtitle?.line1Strong2 || 'sob medida'}.
              <br />
              {heroTexts.subtitle?.line2 || 'com foco em'} <strong>{heroTexts.subtitle?.line2Strong || 'WordPress'}</strong> {heroTexts.subtitle?.line2Rest || ', performance e crescimento sustentável.'}
            </p>
          </div>

          {/* CTAs */}
          <div className="hero-cta-wrapper" ref={ctaRef}>
            <a href="#contact" className="cta-primary">
              <span className="cta-text">{heroTexts.cta?.primary || 'Iniciar Projeto'}</span>
            </a>
            <a href="#services" className="cta-secondary">
              {heroTexts.cta?.secondary || 'Conhecer Serviços'}
            </a>
          </div>
        </div>
      </div>

      {/* Mini textos decorativos */}
      <div className="hero-mini-texts">
        {(heroTexts.decorative?.miniTexts || ['creative', 'code', 'design']).map((text, index) => (
          <span key={index} className={`mini-text mini-text-${index + 1}`}>
            {text}
          </span>
        ))}
      </div>

      <div className="scroll-indicator">
        <div className="scroll-line"></div>
        <span className="scroll-text">{heroTexts.scroll || 'Scroll'}</span>
      </div>
    </section>
  )
}

export default Hero
