import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTexts } from '../hooks/useTexts'
import './Loader.css'

const Loader = ({ onComplete }) => {
  const { texts } = useTexts()
  const [progress, setProgress] = useState(0)
  const logoRef = useRef(null)
  
  // Fallback caso texts ainda não esteja carregado
  const loaderTexts = texts?.loader || {
    logo: {
      main: 'botellho',
      co: 'co.'
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            onComplete()
          }, 500)
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => {
      clearInterval(interval)
    }
  }, [onComplete])

  // Animação de fontes no logo do preloader
  useEffect(() => {
    if (!logoRef.current) return

    const logoText = logoRef.current.querySelector('.loader-logo-main')
    if (!logoText) return

    const text = logoText.textContent || ''
    logoText.innerHTML = ''

    text.split('').forEach((char, index) => {
      const charSpan = document.createElement('span')
      charSpan.className = 'loader-logo-char'
      charSpan.textContent = char === ' ' ? '\u00A0' : char
      charSpan.style.display = 'inline-block'
      charSpan.style.setProperty('--char-index', index)
      logoText.appendChild(charSpan)
    })
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        className="loader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
      >
        <div className="loader-content">
          <motion.div
            className="loader-logo"
            ref={logoRef}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
            }}
          >
            <span className="loader-logo-main">{loaderTexts.logo.main}</span>
            <span className="loader-logo-co">{loaderTexts.logo.co}</span>
          </motion.div>

          <motion.div
            className="loader-progress-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="loader-progress-bar">
              <motion.div
                className="loader-progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Loader
