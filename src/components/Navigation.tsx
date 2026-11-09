import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../data/content'
import { useNavigationScroll } from '../hooks/useNavigationScroll'
import { playEagleSound } from '../utils/sound'

function EagleLogo() {
  return (
    <svg
      className="navigation__logo"
      width="26"
      height="26"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="#0A0F1D" stroke="#1E293B" strokeWidth="1" />
      {/* Left Wing */}
      <path d="M5 13 C8 8 13 7 16 9 C12 11 9 14 7 18 Z" fill="#00F0FF" />
      {/* Right Wing */}
      <path d="M27 13 C24 8 19 7 16 9 C20 11 23 14 25 18 Z" fill="#F59E0B" />
      {/* Eagle Head & Volatility Bolt */}
      <path d="M16 4 L19 12 L23 12 L18 17 L20 25 L16 21 L12 25 L14 17 L9 12 L13 12 Z" fill="#00F0FF" opacity="0.9" />
      <path d="M17 11 L13 19 H17 L15 27 L22 17 H17 L19 11 Z" fill="#F59E0B" />
    </svg>
  )
}

export default function Navigation() {
  const { isScrolled, isScrollingBack } = useNavigationScroll()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const location = useLocation()

  const closeMobileNav = () => {
    setMobileNavOpen(false)
    playEagleSound('click')
  }

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname === href || location.pathname.startsWith(`${href}/`)
  }

  const openLiveDesk = () => {
    window.dispatchEvent(new CustomEvent('open-eagle-chat'))
  }

  return (
    <>
      <div className="navigation-background" />
      <header
        className="navigation"
        data-is-scrolled={isScrolled ? 'true' : 'false'}
        data-is-scrolling-back={isScrollingBack ? 'true' : 'false'}
        data-is-mobile-navigation-active={mobileNavOpen ? 'true' : 'false'}
      >
        <div className="navigation__content">
          <Link
            className={`navigation__home-link${location.pathname === '/' ? ' is-active' : ''}`}
            title="EAGLE VIX SOLUTIONS Home"
            to="/"
            onClick={closeMobileNav}
          >
            <EagleLogo />
            <span className="navigation__wordmark">
              <span className="navigation__wordmark-primary">EAGLE VIX</span>
              <span className="navigation__wordmark-secondary">SOLUTIONS PRO</span>
            </span>
          </Link>

          <nav className="navigation__links-wrapper" aria-label="Main navigation">
            <div className="navigation__links">
              {NAV_LINKS.map((link) => (
                <div key={link.label} className="navigation__link-wrapper">
                  <Link
                    className={`navigation__link${isActive(link.href) ? ' is-active' : ''}`}
                    title={link.label}
                    to={link.href}
                    onClick={() => playEagleSound('click')}
                  >
                    <span className="navigation__link-label">{link.label}</span>
                    {link.badge && (
                      <span
                        className={`navigation__link-badge navigation__link-badge--${link.badgeTone ?? 'accent'}`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </nav>

          <div className="navigation__actions" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <button
              type="button"
              className="button button--ghost"
              style={{
                fontSize: '1.1rem',
                padding: '0.5rem 1.1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: '6px',
                borderColor: 'rgba(0, 240, 255, 0.3)',
              }}
              onClick={openLiveDesk}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#10B981',
                  boxShadow: '0 0 8px #10B981',
                }}
              />
              <span className="fs-mono">VIP DESK</span>
            </button>

            <button
              className={`navigation__toggle navigation-toggle${mobileNavOpen ? ' is-active' : ''}`}
              aria-label={mobileNavOpen ? 'Close main navigation' : 'Open main navigation'}
              aria-expanded={mobileNavOpen}
              onClick={() => {
                setMobileNavOpen((open) => !open)
                playEagleSound('click')
              }}
            >
              <span className="navigation-toggle__icon" />
              <span className="navigation-toggle__icon navigation-toggle__icon--secondary" />
            </button>
          </div>
        </div>
      </header>

      {mobileNavOpen && (
        <div className="navigation__mobile-panel">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              className={`navigation__mobile-link${isActive(link.href) ? ' is-active' : ''}`}
              to={link.href}
              onClick={closeMobileNav}
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className={`navigation__link-badge navigation__link-badge--${link.badgeTone ?? 'accent'}`}>
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <div style={{ padding: '1.2rem', marginTop: '1rem' }}>
            <button
              type="button"
              className="button button--block"
              onClick={() => {
                closeMobileNav()
                openLiveDesk()
              }}
            >
              🦅 Open Live VIP Desk Chat
            </button>
          </div>
        </div>
      )}
    </>
  )
}
