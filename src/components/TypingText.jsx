import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './TypingText.css'

gsap.registerPlugin(ScrollTrigger)

const TypingText = ({ text, gifSrc, className = '' }) => {
  const containerRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return

    const ctx = gsap.context(() => {
      // estado inicial
      gsap.set(textRef.current, {
        clipPath: 'inset(0 100% 0 0)',
      })

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 90%',
        end: 'bottom 10%',
        scrub: true,

        onUpdate: (self) => {
          // 🔥 limite de progresso (35%)
          const cappedProgress = Math.min(self.progress / 0.50, 1)
          const right = 100 - cappedProgress * 100

          gsap.set(textRef.current, {
            clipPath: `inset(0 ${right}% 0 0)`,
          })
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const words = text.split(' ')
  const middle = Math.floor(words.length / 2)
  const beforeWords = words.slice(0, middle)
  const afterWords = words.slice(middle)

  return (
    <section
      ref={containerRef}
      className={`typing-text-container ${className}`}
    >
      <p ref={textRef} className="typing-text">
        <span>
          {beforeWords.map((word, index) => {
            // Variação de fonte: alternar entre serif, display e accent
            const fontVariation = index % 3 === 0 ? 'serif' : index % 3 === 1 ? 'display' : 'accent'
            return (
              <span key={index} className={`typing-word typing-word-${fontVariation}`}>
                {word}
                {index < beforeWords.length - 1 && <span className="typing-space"> </span>}
              </span>
            )
          })}
        </span>

        {gifSrc && (
          <span className="typing-text-gif-placeholder">
            <img
              src={gifSrc}
              alt=""
              className="typing-text-gif"
              draggable="false"
            />
          </span>
        )}

        <span>
          {afterWords.map((word, index) => {
            // Variação de fonte: alternar entre display, accent e serif
            const fontVariation = index % 3 === 0 ? 'display' : index % 3 === 1 ? 'accent' : 'serif'
            return (
              <span key={index} className={`typing-word typing-word-${fontVariation}`}>
                {index > 0 && <span className="typing-space"> </span>}
                {word}
              </span>
            )
          })}
        </span>
      </p>
    </section>
  )
}

export default TypingText
