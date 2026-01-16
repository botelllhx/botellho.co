import { useEffect } from 'react'

export const useCustomCursor = () => {
  useEffect(() => {
    // Apenas em desktop (não touch devices)
    if (window.matchMedia('(pointer: coarse)').matches) {
      document.documentElement.style.cursor = 'auto'
      return
    }

    const cursor = document.createElement('div')
    const cursorDot = document.createElement('div')
    cursor.className = 'cursor'
    cursorDot.className = 'cursor-dot'
    document.body.appendChild(cursor)
    document.body.appendChild(cursorDot)

    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0
    let dotX = 0
    let dotY = 0

    const updateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.1
      cursorY += (mouseY - cursorY) * 0.1
      dotX += (mouseX - dotX) * 0.3
      dotY += (mouseY - dotY) * 0.3

      cursor.style.left = cursorX + 'px'
      cursor.style.top = cursorY + 'px'
      cursorDot.style.left = dotX + 'px'
      cursorDot.style.top = dotY + 'px'

      requestAnimationFrame(updateCursor)
    }

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const handleMouseEnter = () => {
      cursor.classList.add('hover')
    }

    const handleMouseLeave = () => {
      cursor.classList.remove('hover')
    }

    const handleMouseDown = () => {
      cursor.classList.add('click')
    }

    const handleMouseUp = () => {
      cursor.classList.remove('click')
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    // Adicionar hover em elementos interativos
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .portfolio-card, .value-card, .stat-card')
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    updateCursor()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      if (cursor.parentNode) cursor.parentNode.removeChild(cursor)
      if (cursorDot.parentNode) cursorDot.parentNode.removeChild(cursorDot)
    }
  }, [])
}
