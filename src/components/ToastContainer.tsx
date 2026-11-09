import { useEffect, useState } from 'react'
import { subscribeToasts, type ToastItem } from '../utils/toast'

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToasts((toast) => {
      setToasts((prev) => [...prev.slice(-4), toast])

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, toast.duration ?? 4500)
    })

    return unsubscribe
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="eagle-toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`eagle-toast eagle-toast--${toast.type ?? 'info'}`}
          onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
        >
          <div className="eagle-toast__icon">
            {toast.type === 'success' && '✓'}
            {toast.type === 'amber' && '⚡'}
            {toast.type === 'error' && '✕'}
            {(!toast.type || toast.type === 'info') && 'ℹ'}
          </div>
          <div className="eagle-toast__content">
            <div className="eagle-toast__title">{toast.title}</div>
            {toast.message && <div className="eagle-toast__message">{toast.message}</div>}
          </div>
          <button
            type="button"
            className="eagle-toast__close"
            onClick={(e) => {
              e.stopPropagation()
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
