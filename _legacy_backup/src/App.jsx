import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useCustomCursor } from './utils/cursor'
import { initLenis, destroyLenis } from './utils/lenis'
import { useTexts } from './hooks/useTexts'
import Loader from './components/Loader'
import Header from './components/Header'
import Footer from './components/Footer'
import ExitIntentModal from './components/ExitIntentModal'
import WhatsAppButton from './components/WhatsAppButton'
import HomePage from './pages/HomePage'
import ServicePage from './pages/ServicePage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import './App.css'

// Componente interno para lidar com redirecionamento
function AppContent() {
  const { texts } = useTexts()
  const [isLoading, setIsLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()

  useCustomCursor()

  // Tratar redirecionamento do 404.html do GitHub Pages
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const redirectPath = urlParams.get('redirect')
    if (redirectPath) {
      // Remove o parâmetro redirect da URL e navega para a rota correta
      navigate(redirectPath, { replace: true })
    }
  }, [location.search, navigate])

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
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services/:slug" element={<ServicePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
            </Routes>
            <Footer />
            <ExitIntentModal />
            <WhatsAppButton />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
