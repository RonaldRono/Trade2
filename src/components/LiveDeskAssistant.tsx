import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { playEagleSound } from '../utils/sound'
import { handleTelegramClick, TELEGRAM_URL } from '../utils/telegram'
import { PhoneIcon, TelegramIcon, WhatsAppIcon } from './Icons'

interface Message {
  id: string
  sender: 'user' | 'desk'
  text: string
  time: string
  action?: {
    label: string
    to?: string
    href?: string
  }
}

const PRESET_QUESTIONS = [
  '✈️ Contact @porciussdr on Telegram / Call',
  '🔥 How do I catch Boom & Crash spikes?',
  '⚡ Which broker: Deriv or Weltrade?',
  '📈 How does the $100k Challenge work?',
  '💻 How do I install .EX5 on MT5?',
  '🔑 Reset my hardware license key',
]

const AI_RESPONSES: Record<string, { reply: string; action?: { label: string; to?: string; href?: string } }> = {
  '✈️ Contact @porciussdr on Telegram / Call': {
    reply:
      'Direct VIP Trading Desk Contacts:\n• Telegram: @porciussdr (Fastest route - 24/7)\n• Direct Hotline / WhatsApp: +254 799 278 511\n• Email: support@eaglevixsolutions.com\n\nClick below to start a direct Telegram chat with our senior trading systems engineer!',
    action: { label: 'Open Telegram @porciussdr', href: 'https://t.me/porciussdr' },
  },
  '🔥 How do I catch Boom & Crash spikes?': {
    reply:
      'Eagle Vix Prime Spike v3.2 detects micro-tick liquidity clusters 3 to 12 ticks before execution on MT5. It calculates order accumulation with a 95.2% win rate and alerts with instant arrows. Test it directly on our interactive live terminal!',
    action: { label: 'Open Live Terminal', to: '/terminal' },
  },
  '⚡ Which broker: Deriv or Weltrade?': {
    reply:
      'Both are supported! On Deriv, our algorithms specialize in Boom 1000/500/300, Crash 1000/500/300, and Volatility 75/100. On Weltrade, our models dominate Gain X, Pain X, and War X synthetic contracts with zero spread markup.',
    action: { label: 'Browse Spike Detectors', to: '/indicators' },
  },
  '📈 How does the $100k Challenge work?': {
    reply:
      'The $100 to $100k Challenge links your MT5 account to our institutional high-frequency copy trading cluster via low-latency VPS. Our master quants execute synchronous trades over 3-day challenge rounds.',
    action: { label: 'Join 100k Challenge', to: '/challenge' },
  },
  '💻 How do I install .EX5 on MT5?': {
    reply:
      '1. Open MetaTrader 5 -> File -> Open Data Folder -> MQL5 -> Indicators.\n2. Paste your downloaded EagleVix .ex5 file.\n3. Restart MT5 or right-click Navigator -> Refresh.\n4. Drag onto your M1 chart and enter your hardware license key!',
    action: { label: 'View My Licenses', to: '/account' },
  },
  '🔑 Reset my hardware license key': {
    reply:
      'You can instantly reset your HWID binding in the My Account portal without waiting for support. Once reset, launch MT5 on your new machine or VPS and activate automatically.',
    action: { label: 'Go to License Portal', to: '/account' },
  },
}

export default function LiveDeskAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'desk',
      text: 'Welcome to EAGLE VIX SOLUTIONS Desk. Need fast assistance? Reach our lead engineer directly on Telegram @porciussdr or call +254 799 278 511.',
      time: 'Live',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const msgCounter = useRef(100)

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
      playEagleSound('click')
    }
    window.addEventListener('open-eagle-chat', handleOpen)
    return () => window.removeEventListener('open-eagle-chat', handleOpen)
  }, [])

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isTyping])

  const sendQuery = (questionText: string) => {
    if (!questionText.trim()) return

    playEagleSound('click')
    msgCounter.current += 1
    const userMsg: Message = {
      id: `user-${msgCounter.current}`,
      sender: 'user',
      text: questionText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      playEagleSound('success')

      const match = AI_RESPONSES[questionText]
      const replyText =
        match?.reply ??
        `Eagle Vix Senior Desk Engineer has received your query: "${questionText}". All indicator licenses and bridge sync protocols operate 24/7 with under 15 min escalation response time.`

      msgCounter.current += 1
      const deskMsg: Message = {
        id: `desk-${msgCounter.current}`,
        sender: 'desk',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: match?.action,
      }

      setMessages((prev) => [...prev, deskMsg])
    }, 700)
  }

  return (
    <>
      {/* Floating launcher trigger with quick-contact shortcuts */}
      <div className="eagle-desk-launcher-container">
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="eagle-floating-quick-btn eagle-floating-quick-btn--tg"
          title="Direct Telegram @porciussdr"
          onClick={handleTelegramClick}
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
        >
          <TelegramIcon size={16} />
          <span className="eagle-floating-quick-btn__text">@porciussdr</span>
        </a>

        <a
          href="tel:+254799278511"
          className="eagle-floating-quick-btn eagle-floating-quick-btn--phone"
          title="Direct Call +254 799 278 511"
          onClick={() => playEagleSound('click')}
        >
          <PhoneIcon size={16} />
          <span className="eagle-floating-quick-btn__text">+254 799 278 511</span>
        </a>

        <button
          type="button"
          className={`eagle-desk-launcher${isOpen ? ' is-active' : ''}`}
          aria-label="Open EAGLE VIX VIP Trading Desk Assistant"
          onClick={() => {
            setIsOpen((prev) => !prev)
            playEagleSound('click')
          }}
        >
          <span className="eagle-desk-launcher__pulse" />
          <span className="eagle-desk-launcher__icon">🦅</span>
          <span className="eagle-desk-launcher__label">VIP DESK</span>
          <span className="eagle-desk-launcher__badge">LIVE</span>
        </button>
      </div>

      {/* Floating interactive chat panel */}
      {isOpen && (
        <div className="eagle-desk-panel" role="dialog" aria-modal="true" aria-label="EAGLE VIX Live Desk">
          <div className="eagle-desk-panel__header">
            <div className="eagle-desk-panel__header-info">
              <div className="eagle-desk-panel__title">
                <span className="eagle-desk-panel__eagle">🦅</span>
                <span>EAGLE VIX SOLUTIONS</span>
              </div>
              <div className="eagle-desk-panel__status">
                <span className="eagle-desk-panel__dot" />
                <span>VIP Trading Desk · Online (12ms)</span>
              </div>
            </div>
            <button
              type="button"
              className="eagle-desk-panel__close"
              aria-label="Close desk chat"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Quick Direct Reach Bar inside Chat */}
          <div
            style={{
              padding: '0.9rem 1.4rem',
              background: 'rgba(34, 211, 238, 0.08)',
              borderBottom: '1px solid rgba(34, 211, 238, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.6rem',
              flexWrap: 'wrap',
            }}
          >
            <span className="fs-sm" style={{ color: '#22D3EE', fontWeight: 700, letterSpacing: '0.04em' }}>
              DIRECT REACH:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <a
                href="https://t.me/porciussdr"
                target="_blank"
                rel="noopener noreferrer"
                className="button button--ghost"
                style={{
                  fontSize: '1.1rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  borderColor: 'rgba(34, 211, 238, 0.4)',
                  color: '#22D3EE',
                }}
                onClick={() => playEagleSound('click')}
              >
                <TelegramIcon size={12} />
                <span>@porciussdr</span>
              </a>
              <a
                href="tel:+254799278511"
                className="button button--ghost"
                style={{
                  fontSize: '1.1rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  borderColor: 'rgba(251, 191, 36, 0.4)',
                  color: '#FBBF24',
                }}
                onClick={() => playEagleSound('click')}
              >
                <PhoneIcon size={12} />
                <span>+254 799 278 511</span>
              </a>
              <a
                href="https://wa.me/254799278511"
                target="_blank"
                rel="noopener noreferrer"
                className="button button--ghost"
                style={{
                  fontSize: '1.1rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  borderColor: 'rgba(52, 211, 153, 0.4)',
                  color: '#34D399',
                }}
                onClick={() => playEagleSound('click')}
              >
                <WhatsAppIcon size={12} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="eagle-desk-panel__body">
            <div className="eagle-desk-panel__messages">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`eagle-desk-msg eagle-desk-msg--${m.sender}`}
                >
                  <div className="eagle-desk-msg__meta">
                    <span>{m.sender === 'desk' ? 'EAGLE VIX DESK' : 'YOU'}</span>
                    <span>{m.time}</span>
                  </div>
                  <div className="eagle-desk-msg__bubble">
                    <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{m.text}</p>
                    {m.action && (
                      <div style={{ marginTop: '0.8rem' }}>
                        {m.action.to ? (
                          <Link
                            className="button button--ghost"
                            style={{ fontSize: '1.1rem', padding: '0.4rem 1rem' }}
                            to={m.action.to}
                            onClick={() => setIsOpen(false)}
                          >
                            {m.action.label} →
                          </Link>
                        ) : (
                          <a
                            className="button button--ghost"
                            style={{ fontSize: '1.1rem', padding: '0.4rem 1rem' }}
                            href={m.action.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {m.action.label} ↗
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="eagle-desk-msg eagle-desk-msg--desk">
                  <div className="eagle-desk-msg__bubble eagle-desk-msg__typing">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="eagle-desk-panel__presets">
              <div className="eagle-desk-panel__presets-title">Quick Inquiries:</div>
              <div className="eagle-desk-panel__chips">
                {PRESET_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className="chip"
                    onClick={() => sendQuery(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <form
            className="eagle-desk-panel__footer"
            onSubmit={(e) => {
              e.preventDefault()
              sendQuery(input)
            }}
          >
            <input
              type="text"
              className="eagle-desk-panel__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about MT5 indicators, signals or bridge..."
            />
            <button type="submit" className="button" style={{ padding: '0.6rem 1.4rem' }}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  )
}
