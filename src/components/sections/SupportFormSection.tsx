import { useState } from 'react'
import type { CmsSection } from '../../types/cms'

interface SupportFormSectionProps {
  section: CmsSection
}

const SERVERS_BY_BROKER: Record<string, Record<string, string[]>> = {
  Deriv: {
    'Deriv (International)': ['Deriv-Server', 'Deriv-Server-02', 'Deriv-Server-03'],
    'Deriv (SVG) LLC': ['DerivSVG-Server', 'DerivSVG-Server-02', 'DerivSVG-Server-03'],
    'Deriv (BVI) Ltd': ['DerivBVI-Server', 'DerivBVI-Server-02'],
    'Deriv (FX) Ltd': ['DerivFX-Server', 'DerivFX-Server-02'],
    'Deriv Demo': ['Deriv-Demo'],
  },
  Weltrade: {
    'Weltrade Live': ['Weltrade-Live', 'Weltrade-Live-02'],
    'Weltrade Demo': ['Weltrade-Demo'],
  },
}

const RISK_PROFILES = [
  { name: 'Conservative', detail: '1-2% risk' },
  { name: 'Balanced', detail: '3-5% risk' },
  { name: 'Max Surge', detail: 'Compound' },
]

export default function SupportFormSection({ section }: SupportFormSectionProps) {
  const payload = section as unknown as {
    subjects?: string[]
    mode?: 'support' | 'challenge'
  }

  const subjects = payload.subjects ?? []
  const isChallenge = payload.mode === 'challenge'

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState(subjects[0] ?? 'General enquiry')
  const [broker, setBroker] = useState('')
  const [server, setServer] = useState('')
  const [mt5Login, setMt5Login] = useState('')
  const [mt5Pass, setMt5Pass] = useState('')
  const [riskStrategy, setRiskStrategy] = useState('Balanced')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const serverGroups = broker ? SERVERS_BY_BROKER[broker] : null

  if (sent) {
    return (
      <section className="section section--spacious" id="enroll">
        <div className="shell">
          <div className="panel">
            <div className="support-form__success">
              <h4>Message dispatched!</h4>
              <p>
                Thank you, {fullName || 'trader'}. Your inquiry has been routed to our senior
                trading systems engineer. Average response time is under 15 minutes.
                {isChallenge && ' Your challenge slot is held until the payment is confirmed.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section section--spacious" id="enroll">
      <div className="shell">
        <div className="split" style={{ alignItems: 'start' }}>
          <div className="panel">
            <div className="stack stack--md">
              <div className="stack stack--sm">
                <span className="eyebrow">
                  <span className="eyebrow__dot" />
                  {isChallenge ? 'Copy trade bridge enrolment' : 'Send priority support dispatch'}
                </span>
                <h2 className="panel__title">
                  {isChallenge
                    ? 'Enrol in the copy trade challenge'
                    : 'Tell the desk what you need'}
                </h2>
                <p className="text-muted fs-sm">
                  {isChallenge
                    ? 'Connect your MT5 account credentials for automated high-frequency bridge synchronisation.'
                    : 'A senior trading systems engineer will pick it up, and the average response time on the desk is under 15 minutes.'}
                </p>
              </div>

              <form
                className="support-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  setSent(true)
                }}
              >
                <div className="support-form__row">
                  <div className="custom-input__field custom-input__field--is-input">
                    <div className="custom-input__label-input-container">
                      <label className="custom-input__label">
                        <span className="custom-input__label-text">Full Name*</span>
                        <input
                          className="custom-input__input"
                          type="text"
                          required
                          value={fullName}
                          onChange={(event) => setFullName(event.target.value)}
                          placeholder="John Doe"
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
                          placeholder="trader@example.com"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="support-form__row">
                  <div>
                    <label className="price-summary__label" htmlFor="support-broker">
                      Broker
                    </label>
                    <select
                      id="support-broker"
                      className="select-field"
                      style={{ marginTop: '0.8rem' }}
                      value={broker}
                      onChange={(event) => {
                        setBroker(event.target.value)
                        setServer('')
                      }}
                    >
                      <option value="">Select broker</option>
                      <option value="Deriv">Deriv</option>
                      <option value="Weltrade">Weltrade</option>
                    </select>
                  </div>

                  <div>
                    <label className="price-summary__label" htmlFor="support-server">
                      MT5 server
                    </label>
                    <select
                      id="support-server"
                      className="select-field"
                      style={{ marginTop: '0.8rem' }}
                      value={server}
                      disabled={!broker}
                      onChange={(event) => setServer(event.target.value)}
                    >
                      <option value="">{broker ? 'Select server' : 'Select broker first'}</option>
                      {serverGroups &&
                        Object.keys(serverGroups).map((group) => (
                          <optgroup key={group} label={group}>
                            {serverGroups[group].map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      <option value="Other">Other (not listed)</option>
                    </select>
                  </div>
                </div>

                <div className="support-form__row">
                  <div className="custom-input__field custom-input__field--is-input">
                    <div className="custom-input__label-input-container">
                      <label className="custom-input__label">
                        <span className="custom-input__label-text">MT5 login account*</span>
                        <input
                          className="custom-input__input"
                          type="text"
                          required
                          value={mt5Login}
                          onChange={(event) => setMt5Login(event.target.value)}
                          placeholder="e.g. 10928371"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="custom-input__field custom-input__field--is-input">
                    <div className="custom-input__label-input-container">
                      <label className="custom-input__label">
                        <span className="custom-input__label-text">MT5 password*</span>
                        <input
                          className="custom-input__input"
                          type="password"
                          required
                          value={mt5Pass}
                          onChange={(event) => setMt5Pass(event.target.value)}
                          placeholder="••••••••••••"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="price-summary__label" htmlFor="support-subject">
                    Inquiry subject
                  </label>
                  <select
                    id="support-subject"
                    className="select-field"
                    style={{ marginTop: '0.8rem' }}
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                  >
                    {subjects.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {isChallenge && (
                  <div>
                    <label className="price-summary__label">Risk allocation profile</label>
                    <div className="chip-row" style={{ marginTop: '1.2rem' }}>
                      {RISK_PROFILES.map((profile) => (
                        <button
                          key={profile.name}
                          type="button"
                          className={`chip${riskStrategy === profile.name ? ' is-active' : ''}`}
                          onClick={() => setRiskStrategy(profile.name)}
                        >
                          {profile.name} · {profile.detail}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="custom-input__field custom-input__field--is-textarea">
                  <div className="custom-input__label-input-container">
                    <label className="custom-input__label">
                      <span className="custom-input__label-text">Detailed message*</span>
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

                <p className="text-dim fs-sm">
                  Credentials are encrypted with AES-256 and only loaded into our secure
                  copy-trading node for the duration of the challenge.
                </p>

                <div className="cluster">
                  <button type="submit" className="button">
                    {isChallenge ? 'Secure Your Spot — $85.00 USD' : 'Submit to 24/7 Desk'}
                  </button>
                  <button
                    type="button"
                    className="button button--ghost"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('open-eagle-chat'))
                    }}
                  >
                    🦅 Live chat with the desk
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="stack stack--lg">
            <div className="media-figure" style={{ aspectRatio: '4 / 3' }}>
              <img
                className="media-figure__image"
                src={isChallenge ? '/images/challenge-room.jpg' : '/images/global-desk.jpg'}
                alt={isChallenge ? 'Institutional prop trading capital' : '24/7 trading desk support'}
                loading="lazy"
              />
              <span className="media-figure__overlay" />
              <div className="media-figure__caption">
                <span className="media-figure__tag">EAGLE VIX Active</span>
                <span className="media-figure__title">Average response time: under 15 minutes</span>
              </div>
            </div>

            <div className="stack stack--sm">
              <a className="channel-card" href="https://t.me/porciussdr" target="_blank" rel="noopener noreferrer">
                <span className="channel-card__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="m21 4-3 16-6-4.5L9 19l.5-4.5L4 12l17-8Z" />
                    <path d="m9.5 14.5 8-7" />
                  </svg>
                </span>
                <span>
                  <span className="channel-card__label">Direct Telegram (Fastest)</span>
                  <span className="channel-card__value">@porciussdr</span>
                </span>
              </a>

              <a className="channel-card" href="tel:+254799278511">
                <span className="channel-card__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <span>
                  <span className="channel-card__label">Call Hotline (24/7)</span>
                  <span className="channel-card__value">+254 799 278 511</span>
                </span>
              </a>

              <a className="channel-card" href="https://wa.me/254799278511" target="_blank" rel="noopener noreferrer">
                <span className="channel-card__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </span>
                <span>
                  <span className="channel-card__label">WhatsApp Direct</span>
                  <span className="channel-card__value">+254 799 278 511</span>
                </span>
              </a>

              <a className="channel-card" href="mailto:support@eaglevixsolutions.com">
                <span className="channel-card__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>
                <span>
                  <span className="channel-card__label">VIP desk email</span>
                  <span className="channel-card__value">support@eaglevixsolutions.com</span>
                </span>
              </a>

              <div className="channel-card">
                <span className="channel-card__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
                    <path d="M4 14h3v5H5a1 1 0 0 1-1-1v-4Z" />
                    <path d="M20 14h-3v5h2a1 1 0 0 0 1-1v-4Z" />
                  </svg>
                </span>
                <span>
                  <span className="channel-card__label">Supported rails</span>
                  <span className="channel-card__value">Deriv MT5 · Weltrade MT5</span>
                </span>
              </div>
            </div>

            <div className="stack stack--sm">
              <div className="price-summary__label">Instant automated delivery</div>
              <div className="rail-list">
                <span className="rail-chip rail-chip--green">USDT (TRC20)</span>
                <span className="rail-chip rail-chip--green">USDT (BEP20)</span>
                <span className="rail-chip rail-chip--amber">BITCOIN</span>
                <span className="rail-chip">BINANCE PAY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}



