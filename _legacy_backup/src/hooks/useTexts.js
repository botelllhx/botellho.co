import { useState, useEffect } from 'react'
import textsData from '../data/texts.json'

export const useTexts = () => {
  // Garantir que sempre temos um objeto válido
  const [texts, setTexts] = useState(textsData || {})

  // Função para atualizar textos (útil para futuras implementações de i18n)
  const updateTexts = (newTexts) => {
    setTexts(newTexts || {})
  }

  return { texts, updateTexts }
}

export default useTexts
