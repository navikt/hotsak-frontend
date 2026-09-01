import { Stack } from '@navikt/ds-react'
import { createContext, ReactNode, useCallback, useMemo, useState } from 'react'
import { GeneriskToast } from './Toast'
import classes from './ToastContext.module.css'

export type ToastType = 'success' | 'info' | 'warning' | 'error'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
  showSuccessToast: (message: string) => void
  showErrorToast: (message: string) => void
  showInfoToast: (message: string) => void
  showWarningToast: (message: string) => void
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])

    // Automatisk fjerning etter 6 sekunder
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 6000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const value: ToastContextValue = useMemo(
    () => ({
      showToast: addToast,
      showSuccessToast(message: string) {
        addToast(message, 'success')
      },
      showErrorToast(message: string) {
        addToast(message, 'error')
      },
      showInfoToast(message: string) {
        addToast(message, 'info')
      },
      showWarningToast(message: string) {
        addToast(message, 'warning')
      },
    }),
    [addToast]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <Stack className={classes.toastContainerWrapper} gap="space-8" direction={'column-reverse'}>
      {toasts.map((toast) => (
        <GeneriskToast key={toast.id} variant={toast.type} onRemove={() => onRemove(toast.id)}>
          {toast.message}
        </GeneriskToast>
      ))}
    </Stack>
  )
}
