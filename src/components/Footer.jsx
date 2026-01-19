import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Linkedin, Instagram, Youtube } from 'lucide-react'
import { getLenis } from '../utils/lenis'
import { useTexts } from '../hooks/useTexts'
import './Footer.css'

gsap.registerPlugin(ScrollTrigger)

const Footer = () => {
  const { texts } = useTexts()
  const sectionRef = useRef(null)
  const scrollTopRef = useRef(null)
  
  const footerTexts = texts.footer

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
            <h3 className="footer-brand-title">{footerTexts.brand.title}</h3>
            <p className="footer-brand-tagline">
              {footerTexts.brand.tagline}
            </p>
          </div>

          <div className="footer-links">
            <h4 className="footer-links-title">{footerTexts.links.title}</h4>
            <ul className="footer-links-list">
              {footerTexts.links.items.map((link, index) => (
                <li key={index}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-contact">
            <h4 className="footer-contact-title">{footerTexts.contact.title}</h4>
            <ul className="footer-contact-list">
              <li>
                <a href={`mailto:${footerTexts.contact.email}`}>{footerTexts.contact.email}</a>
              </li>
            </ul>
            {footerTexts.social && (
              <div className="footer-social">
                <h4 className="footer-social-title">{footerTexts.social.title}</h4>
                <ul className="footer-social-list">
                  {footerTexts.social.items.map((social, index) => {
                    const getIcon = () => {
                      switch (social.icon) {
                        case 'linkedin':
                          return <Linkedin size={20} />
                        case 'instagram':
                          return <Instagram size={20} />
                        case 'youtube':
                          return <Youtube size={20} />
                        default:
                          return null
                      }
                    }
                    return (
                      <li key={index}>
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.name}
                          className="footer-social-link"
                        >
                          {getIcon()}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} {footerTexts.copyright}
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
