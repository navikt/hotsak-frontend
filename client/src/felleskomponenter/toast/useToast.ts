import { useContext } from 'react'
import { ToastContext } from './ToastContext'

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast må brukes innenfor en ToastProvider')
  }
  return context
}
