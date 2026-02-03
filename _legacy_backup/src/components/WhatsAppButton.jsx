import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useTexts } from '../hooks/useTexts'
import './WhatsAppButton.css'

const WhatsAppButton = () => {
  const { texts } = useTexts()
  const [isVisible, setIsVisible] = useState(false)
  
  const whatsappNumber = texts.footer?.contact?.whatsapp || '5511999999999'

  useEffect(() => {
    // Mostrar botão após scroll de 300px
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = () => {
    const message = encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços da botellho.co')
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
  }

  if (!isVisible) return null

  return (
    <motion.button
      className="whatsapp-button"
      onClick={handleClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle size={24} />
      <span className="whatsapp-button-text">Falar no WhatsApp</span>
    </motion.button>
  )
}

export default WhatsAppButton
