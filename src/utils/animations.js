import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const animateOnScroll = (element, options = {}) => {
  const {
    y = 50,
    opacity = 0,
    duration = 1,
    delay = 0,
    ease = 'power3.out',
  } = options

  gsap.fromTo(
    element,
    {
      y,
      opacity,
    },
    {
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    }
  )
}

export const animateTitle = (element) => {
  gsap.fromTo(
    element,
    {
      scale: 0.8,
      opacity: 0,
    },
    {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  )
}

export const animateCards = (elements) => {
  gsap.fromTo(
    elements,
    {
      y: 60,
      opacity: 0,
      scale: 0.9,
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: elements[0],
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    }
  )
}

export const parallaxElement = (element, speed = 0.5) => {
  gsap.to(element, {
    yPercent: -50 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}

export const floatingAnimation = (element, options = {}) => {
  const { y = 20, duration = 3, delay = 0 } = options
  
  gsap.to(element, {
    y: `+=${y}`,
    duration,
    delay,
    ease: 'power1.inOut',
    yoyo: true,
    repeat: -1,
  })
}

export const rotateAnimation = (element, options = {}) => {
  const { rotation = 360, duration = 20, delay = 0 } = options
  
  gsap.to(element, {
    rotation,
    duration,
    delay,
    ease: 'none',
    repeat: -1,
  })
}
