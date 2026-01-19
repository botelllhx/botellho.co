import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { getLenis } from '../utils/lenis'
import { useTexts } from '../hooks/useTexts'
import './Header.css'

const Header = ({ scrollY }) => {
  const { texts } = useTexts()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentSection, setCurrentSection] = useState('home')
  const [isLightBackground, setIsLightBackground] = useState(false)
  const { scrollYProgress } = useScroll()
  const logoRef = useRef(null)
  
  const headerTexts = texts.header

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setIsScrolled(latest > 0.05)
  })

  // Detectar se está em página com fundo branco
  useEffect(() => {
    const checkBackground = () => {
      const path = location.pathname
      // Páginas com fundo branco: serviços, blog
      const lightPages = ['/services', '/blog']
      const isLight = lightPages.some(page => path.startsWith(page))
      setIsLightBackground(isLight)
    }
    checkBackground()
  }, [location])

  // Detectar seção atual
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'about', 'portfolio', 'contact']
      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animação de fontes no logo
  useEffect(() => {
    if (!logoRef.current) return

    const logoText = logoRef.current
    const text = logoText.textContent || ''
    logoText.innerHTML = ''

    text.split('').forEach((char, index) => {
      const charSpan = document.createElement('span')
      charSpan.className = 'logo-char'
      charSpan.textContent = char === ' ' ? '\u00A0' : char
      charSpan.style.display = 'inline-block'
      charSpan.style.setProperty('--char-index', index)
      logoText.appendChild(charSpan)
    })
  }, [])

  const menuItems = headerTexts.menu

  const handleNavClick = (href) => {
    setIsOpen(false)
    // Se for hash link (#), fazer scroll suave
    if (href.startsWith('#')) {
      const lenis = getLenis()
      if (lenis) {
        lenis.scrollTo(href, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
      } else {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  return (
    <motion.header
      className={`header ${isScrolled ? 'scrolled' : ''} section-${currentSection} ${isLightBackground ? 'light-background' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container">
        <div className="header-content">
          <motion.div
            className="logo"
            ref={logoRef}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="logo-link">
              <span className="logo-text">{headerTexts.logo.main}</span>
              <span className="logo-co">{headerTexts.logo.co}</span>
            </Link>
          </motion.div>

          <nav className={`nav ${isOpen ? 'open' : ''}`}>
            <ul className="nav-list">
              {menuItems.map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.href.startsWith('#') ? (
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault()
                        if (location.pathname === '/') {
                          handleNavClick(item.href)
                        } else {
                          window.location.href = `/${item.href}`
                        }
                      }}
                      className={`nav-link ${currentSection === item.href.slice(1) ? 'active' : ''}`}
                    >
                      <span>{item.label}</span>
                      <motion.div
                        className="nav-link-underline"
                        whileHover={{ scaleX: 1 }}
                        initial={{ scaleX: 0 }}
                      />
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="nav-link"
                    >
                      <span>{item.label}</span>
                      <motion.div
                        className="nav-link-underline"
                        whileHover={{ scaleX: 1 }}
                        initial={{ scaleX: 0 }}
                      />
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </nav>

          <motion.button
            className="menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="menu-icon">
              <span className={`menu-line ${isOpen ? 'open' : ''}`}></span>
              <span className={`menu-line ${isOpen ? 'open' : ''}`}></span>
              <span className={`menu-line ${isOpen ? 'open' : ''}`}></span>
            </span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
