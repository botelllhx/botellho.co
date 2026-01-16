import Lenis from 'lenis'

let lenis = null
let rafId = null

export const initLenis = () => {
  if (typeof window === 'undefined') return null

  // Destruir instância anterior se existir
  if (lenis) {
    destroyLenis()
  }

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  })

  function raf(time) {
    lenis.raf(time)
    rafId = requestAnimationFrame(raf)
  }

  rafId = requestAnimationFrame(raf)

  // Integrar com GSAP ScrollTrigger
  lenis.on('scroll', () => {
    if (window.ScrollTrigger) {
      window.ScrollTrigger.update()
    }
  })

  return lenis
}

export const destroyLenis = () => {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (lenis) {
    lenis.destroy()
    lenis = null
  }
}

export const getLenis = () => lenis

export default lenis
