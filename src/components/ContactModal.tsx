import { useEffect, useState } from 'react'
import { emitToast } from '../utils/toast'
import { playEagleSound } from '../utils/sound'
import { PhoneIcon, TelegramIcon, WhatsAppIcon } from './Icons'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

const SUBJECTS = [
  'Indicator Installation Support',
  '100k Challenge Bridge Assistance',
  'License Key HWID Reset',
  'Custom EA or Algorithm Request',
  'Crypto / Deriv Payment Verification',
]

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const reset = () => {
    setName('')
    setEmail('')
    setSubject(SUBJECTS[0])
    setMessage('')
    setSent(false)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setSent(true)
    playEagleSound('success')
    emitToast({
      title: 'Dispatch Submitted',
      message: `Priority ticket created for ${name}. Escalated to EAGLE VIX Senior Trading Engineer.`,
      type: 'success',
    })
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-label="Contact EAGLE VIX VIP trading desk">
        <button
          type="button"
          className="modal__close"
          aria-label="Close contact form"
          onClick={() => {
            playEagleSound('click')
            onClose()
          }}
        >
          ✕
        </button>

        <span className="eyebrow eyebrow--amber">
          <span className="eyebrow__dot" />
          EAGLE VIX SOLUTIONS · 24/7 Dedicated VIP Trading Support
        </span>
        <h2 className="modal__title">Send a priority support dispatch</h2>
        <p className="modal__text">
          Tell us what you need. A senior EAGLE VIX quantitative systems engineer will pick it up,
          and the average response time on the desk is under 15 minutes.
        </p>

        <div
          style={{
            marginTop: '1.6rem',
            padding: '1.2rem 1.4rem',
            background: 'rgba(0, 240, 255, 0.05)',
            border: '1px solid rgba(0, 240, 255, 0.25)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
          }}
        >
          <div className="fs-sm" style={{ color: '#00F0FF', fontWeight: 700, letterSpacing: '0.05em' }}>
            ⚡ INSTANT VIP REACH CHANNELS:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
            <a
              href="https://t.me/porciussdr"
              target="_blank"
              rel="noopener noreferrer"
              className="button button--ghost"
              style={{ fontSize: '1.15rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => playEagleSound('click')}
            >
              <TelegramIcon size={14} />
              <span>Telegram: <strong>@porciussdr</strong></span>
            </a>
            <a
              href="tel:+254799278511"
              className="button button--ghost"
              style={{ fontSize: '1.15rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => playEagleSound('click')}
            >
              <PhoneIcon size={14} />
              <span>Call: <strong>+254 799 278 511</strong></span>
            </a>
            <a
              href="https://wa.me/254799278511"
              target="_blank"
              rel="noopener noreferrer"
              className="button button--ghost"
              style={{ fontSize: '1.15rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => playEagleSound('click')}
            >
              <WhatsAppIcon size={14} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {sent ? (
          <div className="support-form__success" style={{ marginTop: '2.4rem' }}>
            <h4>Message dispatched to EAGLE VIX Desk!</h4>
            <p>
              Thank you, {name}. Your inquiry has been routed to our senior trading systems
              engineer. Average response time is under 15 minutes.
            </p>
            <div className="modal__actions">
              <button
                type="button"
                className="button button--ghost"
                onClick={() => {
                  playEagleSound('click')
                  reset()
                  onClose()
                }}
              >
                Close
              </button>
              <button
                type="button"
                className="button"
                onClick={() => {
                  playEagleSound('click')
                  reset()
                }}
              >
                Send Another Message
              </button>
            </div>
          </div>
        ) : (
          <form
            className="support-form"
            style={{ marginTop: '2.4rem' }}
            onSubmit={handleSubmit}
          >
            <div className="support-form__row">
              <div className="custom-input__field custom-input__field--is-input">
                <div className="custom-input__label-input-container">
                  <label className="custom-input__label">
                    <span className="custom-input__label-text">Your Full Name*</span>
                    <input
                      className="custom-input__input"
                      type="text"
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </label>
                </div>
              </div>

              <div className="custom-input__field custom-input__field--is-input">
                <div className="custom-input__label-input-container">
                  <label className="custom-input__label">
                    <span className="custom-input__label-text">Email Address*</span>
                    <input
                      className="custom-input__input"
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </label>
                </div>
              </div>
            </div>

            <label className="custom-input__label-text" style={{ position: 'static', transform: 'none' }}>
              Inquiry Subject
            </label>
            <select className="select-field" value={subject} onChange={(event) => setSubject(event.target.value)}>
              {SUBJECTS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <div className="custom-input__field custom-input__field--is-textarea">
              <div className="custom-input__label-input-container">
                <label className="custom-input__label">
                  <span className="custom-input__label-text">Detailed Message*</span>
                  <textarea
                    className="custom-input__input"
                    required
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Describe your question, broker details, or MT5 error codes..."
                  />
                </label>
              </div>
            </div>

            <div className="modal__actions">
              <button
                type="submit"
                className="button"
                onClick={() => playEagleSound('click')}
              >
                Submit to EAGLE VIX Desk
              </button>
              <button
                type="button"
                className="button button--ghost"
                onClick={() => {
                  playEagleSound('click')
                  onClose()
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
