import { playEagleSound } from './sound'

export const TELEGRAM_URL = 'https://t.me/porciussdr'
export const TELEGRAM_USERNAME = '@porciussdr'
export const TELEGRAM_PROTOCOL = 'tg://resolve?domain=porciussdr'

/**
 * Robust handler to open Telegram across web, mobile, and desktop apps.
 */
export function handleTelegramClick(e?: React.MouseEvent) {
  playEagleSound('click')

  try {
    // Attempt to invoke the native Telegram desktop/mobile protocol
    const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (!isMobile) {
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = TELEGRAM_PROTOCOL
      document.body.appendChild(iframe)
      setTimeout(() => {
        try {
          document.body.removeChild(iframe)
        } catch {}
      }, 1500)
    }
  } catch {}

  // If invoked programmatically without a native link navigation
  if (e?.defaultPrevented) {
    window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer')
  }
}
