import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTexts } from '../hooks/useTexts'
import './ExitIntentModal.css'

const ExitIntentModal = () => {
  const { texts } = useTexts()
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  
  const whatsappNumber = texts.footer?.contact?.whatsapp || '5511999999999'
  
  // Usar refs para manter valores entre renders
  const hasLeftTabRef = useRef(false)
  const returnTimerRef = useRef(null)
  const mouseLeaveTimerRef = useRef(null)
  const hasShownRef = useRef(false)
  const isOpenRef = useRef(false)
  
  // Sincronizar refs com state
  useEffect(() => {
    hasShownRef.current = hasShown
    isOpenRef.current = isOpen
  }, [hasShown, isOpen])

  useEffect(() => {
    // Verificar se já mostrou antes (localStorage)
    const hasShownBefore = localStorage.getItem('exitIntentShown')
    if (hasShownBefore) {
      setHasShown(true)
      return
    }

    // Detectar quando a aba perde o foco (usuário muda de aba ou minimiza)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Aba perdeu o foco - marcar que o usuário saiu
        hasLeftTabRef.current = true
      } else {
        // Aba voltou ao foco - se o usuário tinha saído, mostrar modal
        if (hasLeftTabRef.current && !hasShownRef.current && !isOpenRef.current) {
          // Limpar timer anterior se existir
          if (returnTimerRef.current) {
            clearTimeout(returnTimerRef.current)
          }
          
          // Mostrar modal após um pequeno delay quando voltar
          returnTimerRef.current = setTimeout(() => {
            // Verificar novamente antes de mostrar
            if (!hasShownRef.current && !isOpenRef.current) {
              setIsOpen(true)
              setHasShown(true)
              localStorage.setItem('exitIntentShown', 'true')
              hasLeftTabRef.current = false
            }
          }, 500) // Delay de 500ms após voltar ao foco
        }
      }
    }

    // Detectar quando a janela perde o foco (mudança de aba)
    const handleBlur = () => {
      if (!hasShownRef.current && !isOpenRef.current) {
        hasLeftTabRef.current = true
      }
    }

    // Detectar quando a janela volta ao foco
    const handleFocus = () => {
      if (hasLeftTabRef.current && !hasShownRef.current && !isOpenRef.current) {
        // Limpar timer anterior se existir
        if (returnTimerRef.current) {
          clearTimeout(returnTimerRef.current)
        }
        
        // Mostrar modal após um pequeno delay
        returnTimerRef.current = setTimeout(() => {
          // Verificar novamente antes de mostrar
          if (!hasShownRef.current && !isOpenRef.current) {
            setIsOpen(true)
            setHasShown(true)
            localStorage.setItem('exitIntentShown', 'true')
            hasLeftTabRef.current = false
          }
        }, 500)
      }
    }

    // Detectar movimento do mouse saindo da tela (exit intent clássico)
    const handleMouseLeave = (e) => {
      // Se o mouse sair pela parte superior da tela (movimento para cima)
      if (e.clientY <= 10 && !hasShownRef.current && !isOpenRef.current && !document.hidden) {
        // Limpar timer anterior se existir
        if (mouseLeaveTimerRef.current) {
          clearTimeout(mouseLeaveTimerRef.current)
        }
        
        // Delay pequeno para confirmar que realmente saiu
        mouseLeaveTimerRef.current = setTimeout(() => {
          // Verificar novamente antes de mostrar
          if (!hasShownRef.current && !isOpenRef.current) {
            setIsOpen(true)
            setHasShown(true)
            localStorage.setItem('exitIntentShown', 'true')
          }
        }, 150)
      }
    }

    // Cancelar timer se mouse voltar
    const handleMouseEnter = () => {
      if (mouseLeaveTimerRef.current) {
        clearTimeout(mouseLeaveTimerRef.current)
        mouseLeaveTimerRef.current = null
      }
    }

    // Adicionar event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      if (returnTimerRef.current) clearTimeout(returnTimerRef.current)
      if (mouseLeaveTimerRef.current) clearTimeout(mouseLeaveTimerRef.current)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [hasShown, isOpen])

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços da botellho.co')
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
    setIsOpen(false)
  }

  const handleContact = () => {
    window.location.href = '/#contact'
    setIsOpen(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="exit-intent-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="exit-intent-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <button
              className="exit-intent-close"
              onClick={handleClose}
              aria-label="Fechar"
            >
              <X size={24} />
            </button>

            <div className="exit-intent-content">
              <span className="exit-intent-badge">Oferta Especial</span>
              <h2 className="exit-intent-title">
                Antes de ir embora
              </h2>
              <p className="exit-intent-text">
                Que tal conversarmos sobre seu projeto? Oferecemos soluções personalizadas em desenvolvimento web, WordPress e UX/UI Design.
              </p>
              <p className="exit-intent-highlight">
                Vamos criar algo incrível juntos?
              </p>

              <div className="exit-intent-buttons">
                <button
                  className="exit-intent-button exit-intent-button-primary"
                  onClick={handleWhatsApp}
                >
                  <span>Falar no WhatsApp</span>
                </button>
                <button
                  className="exit-intent-button exit-intent-button-secondary"
                  onClick={handleContact}
                >
                  <span>Ver Contato</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ExitIntentModal
