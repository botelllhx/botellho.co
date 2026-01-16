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
  const beforeText = words.slice(0, middle).join(' ')
  const afterText = words.slice(middle).join(' ')

  return (
    <section
      ref={containerRef}
      className={`typing-text-container ${className}`}
    >
      <p ref={textRef} className="typing-text">
        <span>{beforeText} </span>

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

        <span> {afterText}</span>
      </p>
    </section>
  )
}

export default TypingText
