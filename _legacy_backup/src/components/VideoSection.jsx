import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './VideoSection.css'

gsap.registerPlugin(ScrollTrigger)

const VideoSection = ({ id, text, position = 'top-right', videoSrc }) => {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const textRef = useRef(null)
  const videoElementRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Parallax do vídeo - otimizado
      if (videoRef.current) {
        gsap.to(videoRef.current, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      }

      // Animação do texto - apenas fade in
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id={id} className="video-section" ref={sectionRef}>
      <div className="video-background" ref={videoRef}>
        {videoSrc ? (
          <video
            ref={videoElementRef}
            className="video-element"
            autoPlay
            loop
            muted
            playsInline
            src={videoSrc}
          />
        ) : (
          <div className="video-placeholder">
            <div className="video-overlay-gradient"></div>
          </div>
        )}
      </div>
      <div className={`video-text-overlay video-text-${position}`} ref={textRef}>
        <p className="video-text">{text}</p>
      </div>
    </section>
  )
}

export default VideoSection
