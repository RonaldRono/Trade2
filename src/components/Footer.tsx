import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FOOTER_EXTENSION, FOOTER_LINKS, FOOTER_LOGO, type HeroSectionData } from '../data/content'
import ContactModal from './ContactModal'
import HeroV3 from './HeroV3'
import { HeadsetIcon, MailIcon, PhoneIcon, TelegramIcon, TerminalIcon } from './Icons'
import { emitToast } from '../utils/toast'
import { playEagleSound } from '../utils/sound'

export interface FooterExtensionConfig extends HeroSectionData {
  backgroundImage?: string
}

interface FooterProps {
  showExtension?: boolean
  extension?: FooterExtensionConfig | null
}

const CHANNEL_LINKS = [
  {
    label: 'VIP Desk Telegram (@porciussdr)',
    href: 'https://t.me/porciussdr',
    external: true,
    icon: <TelegramIcon size={16} />,
  },
  {
    label: 'Direct Phone (+254 799 278 511)',
    href: 'tel:+254799278511',
    external: false,
    icon: <PhoneIcon size={16} />,
  },
  {
    label: 'Email the trading desk',
    href: 'mailto:support@eaglevixsolutions.com',
    external: false,
    icon: <MailIcon size={16} />,
  },
  {
    label: 'Live terminal',
    href: '/terminal',
    external: false,
    icon: <TerminalIcon size={16} />,
  },
  {
    label: 'VIP signals channel',
    href: '/signals',
    external: false,
    icon: <HeadsetIcon size={16} />,
  },
] as const

export default function Footer({ showExtension = true, extension }: FooterProps) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  const extensionSection = extension ?? FOOTER_EXTENSION

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    playEagleSound('success')
    setSubscribed(true)
    emitToast({
      title: 'Subscribed to VIP Dispatch',
      message: `${email} is now registered for EAGLE VIX SOLUTIONS algorithm drops.`,
      type: 'success',
    })
    setEmail('')
    setTimeout(() => setSubscribed(false), 5000)
  }

  return (
    <>
      <footer id="footer" className="footer">
        {showExtension && (
          <div className="footer__extension">
            <HeroV3 section={extensionSection} />
          </div>
        )}

        <div className="footer__content-wrapper">
          <div className="footer__content">
            <div className="footer__top">
              <div className="footer__left">
                <div className="footer__left-inner">
                  <Link to="/" title="EAGLE VIX SOLUTIONS home">
                    <img
                      alt="EAGLE VIX SOLUTIONS"
                      src={FOOTER_LOGO}
                      width={320}
                      height={60}
                      decoding="async"
                      className="footer__logo"
                      loading="lazy"
                    />
                  </Link>

                  <section className="footer__newsletter-container">
                    <h2 className="footer__newsletter-heading" style={{ fontSize: '1.4rem' }}>Keep up with EAGLE VIX</h2>
                    <p className="footer__newsletter-description">
                      Get signal releases, new MT5 indicator builds and 100k challenge round announcements.
                    </p>

                    <form
                      className="newsletter-form footer__newsletter-component"
                      aria-label="Subscribe to newsletter"
                      onSubmit={handleNewsletterSubmit}
                    >
                      <div className="custom-input__field custom-input__field--is-input">
                        <div className="custom-input__label-input-container">
                          <label className="custom-input__label">
                            <span className="custom-input__label-text">Email Address*</span>
                            <input
                              className="custom-input__input"
                              name="email"
                              type="email"
                              required
                              aria-invalid="false"
                              value={email}
                              onChange={(event) => setEmail(event.target.value)}
                              placeholder="trader@quant-desk.com"
                            />
                          </label>
                          <button
                            type="submit"
                            className="newsletter-form__button"
                            onClick={() => playEagleSound('click')}
                          >
                            Sign Up
                          </button>
                        </div>
                      </div>
                      {subscribed && (
                        <p className="text-green fs-sm" style={{ marginTop: '0.8rem' }}>
                          ✓ Subscribed! You will receive VIP Eagle Vix spike drops.
                        </p>
                      )}
                    </form>
                  </section>

                  <nav className="footer__social-links" aria-label="Quick channels">
                    {CHANNEL_LINKS.map((channel) => (
                      <a
                        key={channel.label}
                        className="footer__social-link"
                        title={channel.label}
                        {...(channel.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        href={channel.href}
                        onClick={() => playEagleSound('click')}
                      >
                        {channel.icon}
                      </a>
                    ))}
                  </nav>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="footer__contact-button"
                      aria-label="Open contact form"
                      onClick={() => {
                        playEagleSound('click')
                        setContactOpen(true)
                      }}
                    >
                      Contact Us
                      <span className="icon arrow-button__icon icon--arrow">
                        <span className="icon__solid">
                          <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M1 15.4907L14.9814 1.50928M14.9814 1.50928H1M14.9814 1.50928V15.4907" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        </span>
                      </span>
                    </button>
                    <a
                      href="https://t.me/porciussdr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button button--ghost"
                      style={{ fontSize: '1.15rem', padding: '0.7rem 1.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
                      onClick={() => playEagleSound('click')}
                    >
                      <TelegramIcon size={14} />
                      <span>Telegram @porciussdr</span>
                    </a>
                    <a
                      href="tel:+254799278511"
                      className="button button--ghost"
                      style={{ fontSize: '1.15rem', padding: '0.7rem 1.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
                      onClick={() => playEagleSound('click')}
                    >
                      <PhoneIcon size={14} />
                      <span>+254 799 278 511</span>
                    </a>
                  </div>
                </div>
              </div>

              <nav className="footer__primary-links" aria-label="Site links">
                {FOOTER_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    className="footer__primary-link"
                    title={link.label}
                    to={link.href}
                    onClick={() => playEagleSound('click')}
                  >
                    <span className="footer__primary-link-label">{link.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="footer__bottom">
              <nav className="footer__secondary-links" aria-label="Legal Site links">
                <p className="footer__copyright">© EAGLE VIX SOLUTIONS &amp; MT5 Systems 2026.</p>
                <Link className="footer__secondary-link" to="/terms-and-conditions" onClick={() => playEagleSound('click')}>
                  Terms &amp; Conditions
                </Link>
                <Link className="footer__secondary-link" to="/privacy-policy" onClick={() => playEagleSound('click')}>
                  Privacy Policy
                </Link>
                <Link className="footer__secondary-link" to="/risk-disclosure" onClick={() => playEagleSound('click')}>
                  Risk Disclosure
                </Link>
              </nav>

              <p className="footer__risk">
                <strong>Risk Disclosure:</strong> Trading Boom &amp; Crash, synthetic indices, and
                volatility contracts on margin carries high risk and may not be suitable for all
                investors. EAGLE VIX SOLUTIONS provides quantitative software tools, algorithmic signals
                and educational indicators. Never risk capital you cannot afford to lose.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}
