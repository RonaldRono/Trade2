import { Link } from 'react-router-dom'
import { playEagleSound } from '../utils/sound'

interface ActionProps {
  label: string
  href?: string
  external?: boolean
  variant?: 'default' | 'accent' | 'green' | 'amber'
  onClick?: () => void
}

function DiagonalArrow() {
  return (
    <svg
      width="12"
      height="13"
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="action__icon"
      data-icon-type="diagonal-arrow"
      aria-hidden="true"
    >
      <path d="M0.75 11.75L11.25 1.25M11.25 1.25H0.75M11.25 1.25V11.75" stroke="currentColor" />
    </svg>
  )
}

export default function Action({ label, href, external, variant = 'default', onClick }: ActionProps) {
  const className = ['action', variant !== 'default' ? `action--${variant}` : ''].filter(Boolean).join(' ')

  const handleClick = (e: React.MouseEvent) => {
    playEagleSound('click')
    if (onClick) {
      onClick()
      return
    }

    if (href && href.startsWith('#')) {
      e.preventDefault()
      const element = document.getElementById(href.slice(1))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  if (onClick || !href) {
    return (
      <button type="button" className={className} onClick={handleClick}>
        <span className="action__label">
          {label}
          <DiagonalArrow />
        </span>
      </button>
    )
  }

  const isInternal = href.startsWith('/') && !external

  if (isInternal) {
    return (
      <Link to={href} className={className} onClick={handleClick} title={label}>
        <span className="action__label">
          {label}
          <DiagonalArrow />
        </span>
      </Link>
    )
  }

  return (
    <a
      title={label}
      href={href}
      className={className}
      onClick={handleClick}
      {...(external || href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span className="action__label">
        {label}
        <DiagonalArrow />
      </span>
    </a>
  )
}
