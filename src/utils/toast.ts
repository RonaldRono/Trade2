export interface ToastItem {
  id: string
  title: string
  message?: string
  type?: 'success' | 'info' | 'amber' | 'error'
  duration?: number
}

type ToastListener = (toast: ToastItem) => void
const listeners = new Set<ToastListener>()

let toastCounter = 0

export function subscribeToasts(listener: ToastListener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function emitToast(toast: Omit<ToastItem, 'id'>) {
  toastCounter += 1
  const item: ToastItem = {
    ...toast,
    id: `toast-${Date.now()}-${toastCounter}`,
    duration: toast.duration ?? 4500,
  }
  listeners.forEach((fn) => fn(item))
}
