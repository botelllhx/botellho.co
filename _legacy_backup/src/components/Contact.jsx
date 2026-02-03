import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTexts } from '../hooks/useTexts'
import './Contact.css'

gsap.registerPlugin(ScrollTrigger)

const Contact = () => {
  const { texts } = useTexts()
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const formRef = useRef(null)
  const infoRef = useRef(null)
  const parallaxRef = useRef(null)
  
  const contactTexts = texts.contact

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Opção 1: EmailJS (recomendado - gratuito até 200 emails/mês)
      // Configure em: https://www.emailjs.com/
      // Adicione as variáveis no .env:
      // VITE_EMAILJS_SERVICE_ID=seu_service_id
      // VITE_EMAILJS_TEMPLATE_ID=seu_template_id
      // VITE_EMAILJS_PUBLIC_KEY=sua_public_key
      
      const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      
      if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
        // Carregar EmailJS dinamicamente
        const emailjs = await import('@emailjs/browser')
        emailjs.default.init(emailjsPublicKey)
        
        await emailjs.default.send(
          emailjsServiceId,
          emailjsTemplateId,
          {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_email: 'contato@botellho.com',
          }
        )
      } else {
        // Opção 2: Formspree (alternativa)
        // Configure em: https://formspree.io/
        // Adicione no .env: VITE_FORMSPREE_ID=seu_form_id
        const formspreeId = import.meta.env.VITE_FORMSPREE_ID
        
        if (formspreeId) {
          const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              subject: formData.subject,
              message: formData.message,
            }),
          })
          
          if (!response.ok) {
            throw new Error('Erro ao enviar formulário')
          }
        } else {
          // Fallback: apenas log (para desenvolvimento)
          console.log('Form submitted:', formData)
          console.warn('Configure EmailJS ou Formspree no .env para enviar emails')
        }
      }
      
      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({ name: '', email: '', subject: '', message: '' })
      }, 3000)
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
      alert('Erro ao enviar mensagem. Tente novamente ou envie um email diretamente para contato@botellho.com')
    }
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
            <span className="title-number">{contactTexts.title.number}</span>
            <span className="title-main">{contactTexts.title.main}</span>
          </h2>
          <p className="contact-intro">
            {contactTexts.intro}
          </p>
        </div>

        <div className="contact-layout">
          {/* Informações de contato */}
          <div className="contact-info" ref={infoRef}>
            <div className="contact-info-item">
              <div className="contact-info-label">{contactTexts.info.email.label}</div>
              <a href={`mailto:${contactTexts.info.email.value}`} className="contact-info-value">
                {contactTexts.info.email.value}
              </a>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-label">{contactTexts.info.availability.label}</div>
              <div className="contact-info-value">{contactTexts.info.availability.value}</div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-label">{contactTexts.info.response.label}</div>
              <div className="contact-info-value">{contactTexts.info.response.value}</div>
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
                <label htmlFor="name">{contactTexts.form.name.label}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder={contactTexts.form.name.placeholder}
                  className={focusedField === 'name' ? 'focused' : ''}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">{contactTexts.form.email.label}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder={contactTexts.form.email.placeholder}
                  className={focusedField === 'email' ? 'focused' : ''}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">{contactTexts.form.subject.label}</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onFocus={() => setFocusedField('subject')}
                onBlur={() => setFocusedField(null)}
                required
                placeholder={contactTexts.form.subject.placeholder}
                className={focusedField === 'subject' ? 'focused' : ''}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">{contactTexts.form.message.label}</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                required
                rows="6"
                placeholder={contactTexts.form.message.placeholder}
                className={focusedField === 'message' ? 'focused' : ''}
              />
            </div>

            <button type="submit" className="btn-submit">
              {isSubmitted ? (
                <span>{contactTexts.form.submit.success}</span>
              ) : (
                <span>{contactTexts.form.submit.default}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
