import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Contact.css'

gsap.registerPlugin(ScrollTrigger)

const Contact = () => {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const formRef = useRef(null)
  const infoRef = useRef(null)
  const parallaxRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Parallax background
      if (parallaxRef.current) {
        gsap.to(parallaxRef.current, {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }

      // Animações só de entrada
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        )
      }

      if (infoRef.current) {
        gsap.fromTo(
          infoRef.current,
          {
            opacity: 0,
            x: -50,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: infoRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        )
      }

      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          {
            opacity: 0,
            x: 50,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 85%',
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
    <section id="contact" className="contact section" ref={sectionRef}>
      {/* Parallax background */}
      <div className="contact-parallax" ref={parallaxRef}>
        <div className="contact-background-pattern"></div>
        <div className="contact-background-lines"></div>
      </div>

      <div className="contact-container">
        <div className="contact-header">
          <h2 className="contact-title" ref={titleRef}>
            <span className="title-number">05</span>
            <span className="title-main">CONTATO</span>
          </h2>
          <p className="contact-intro">
            Pronto para transformar sua ideia em realidade? Entre em contato e vamos conversar sobre seu projeto.
          </p>
        </div>

        <div className="contact-layout">
          {/* Informações de contato */}
          <div className="contact-info" ref={infoRef}>
            <div className="contact-info-item">
              <div className="contact-info-label">Email</div>
              <a href="mailto:contato@botellho.co" className="contact-info-value">
                contato@botellho.co
              </a>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-label">Disponibilidade</div>
              <div className="contact-info-value">Segunda a Sexta, 9h às 18h</div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-label">Resposta</div>
              <div className="contact-info-value">Até 24 horas úteis</div>
            </div>
          </div>

          {/* Formulário */}
          <form
            id="contact-form"
            className="contact-form"
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nome</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="Seu nome completo"
                  className={focusedField === 'name' ? 'focused' : ''}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="seu@email.com"
                  className={focusedField === 'email' ? 'focused' : ''}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Assunto</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onFocus={() => setFocusedField('subject')}
                onBlur={() => setFocusedField(null)}
                required
                placeholder="Sobre o que você gostaria de conversar?"
                className={focusedField === 'subject' ? 'focused' : ''}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Mensagem</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                required
                rows="6"
                placeholder="Conte-nos sobre seu projeto, ideias ou dúvidas..."
                className={focusedField === 'message' ? 'focused' : ''}
              />
            </div>

            <button type="submit" className="btn-submit">
              {isSubmitted ? (
                <span>Enviado com sucesso!</span>
              ) : (
                <span>Enviar Mensagem</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
