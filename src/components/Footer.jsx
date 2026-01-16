import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis } from '../utils/lenis'
import './Footer.css'

gsap.registerPlugin(ScrollTrigger)

const Footer = () => {
  const sectionRef = useRef(null)
  const scrollTopRef = useRef(null)

  const scrollToTop = () => {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      if (scrollTopRef.current) {
        gsap.fromTo(
          scrollTopRef.current,
          {
            opacity: 0,
            scale: 0.8,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
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
    <footer className="footer section" ref={sectionRef}>
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-brand-title">botellho.co</h3>
            <p className="footer-brand-tagline">
              Desenvolvimento web com criatividade e propósito
            </p>
          </div>

          <div className="footer-links">
            <h4 className="footer-links-title">Links Rápidos</h4>
            <ul className="footer-links-list">
              <li>
                <a href="#home">Início</a>
              </li>
              <li>
                <a href="#services">Serviços</a>
              </li>
              <li>
                <a href="#about">Sobre</a>
              </li>
              <li>
                <a href="#portfolio">Portfólio</a>
              </li>
              <li>
                <a href="#contact">Contato</a>
              </li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4 className="footer-contact-title">Contato</h4>
            <ul className="footer-contact-list">
              <li>
                <a href="mailto:contato@botellho.co">contato@botellho.co</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} botellho.co Todos os direitos reservados.
          </p>
          <button
            className="footer-scroll-top"
            ref={scrollTopRef}
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <span className="scroll-top-arrow">↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
