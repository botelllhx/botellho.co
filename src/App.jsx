import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCustomCursor } from './utils/cursor'
import { initLenis, destroyLenis } from './utils/lenis'
import { useTexts } from './hooks/useTexts'
import Loader from './components/Loader'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import VideoSection from './components/VideoSection'
import About from './components/About'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './App.css'

function App() {
  const { texts } = useTexts()
  const [isLoading, setIsLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)

  useCustomCursor()

  // Atualizar título e meta description dinamicamente
  useEffect(() => {
    document.title = texts.meta.title
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', texts.meta.description)
    }
  }, [texts])

  // Inicializar Lenis após o loader
  useEffect(() => {
    if (!isLoading) {
      const lenis = initLenis()
      
      // Integrar Lenis com GSAP ScrollTrigger
      if (lenis && window.gsap) {
        lenis.on('scroll', () => {
          window.gsap.update()
        })
      }
      
      return () => {
        destroyLenis()
      }
    }
  }, [isLoading])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app">
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Header scrollY={scrollY} />
            <main>
              <Hero />
              <Services />
              {/* Primeira seção de vídeo - antes de About */}
              <VideoSection
                id="videos-1"
                text={texts.videos.video1.text}
                position="top-right"
                videoSrc="/videos/video-1.mp4"
              />
              <About />
              <Portfolio />
              {/* Segunda seção de vídeo - entre Portfolio e Contact */}
              <VideoSection
                id="videos-2"
                text={texts.videos.video2.text}
                position="bottom-left"
                videoSrc="/videos/video-2.mp4"
              />
              <Contact />
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
