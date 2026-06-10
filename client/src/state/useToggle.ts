import { useCallback, useState } from 'react'

export function useToggle(initialState: boolean | (() => boolean) = false): [boolean, (...args: unknown[]) => void] {
  const [state, setState] = useState(initialState)
  const toggle = useCallback((...args: unknown[]) => {
    if (typeof args[0] === 'boolean') {
      setState(args[0])
    } else {
      setState((state) => !state)
    }
  }, [])
  return [state, toggle]
}

export function useDialogToggle(initialState: boolean | (() => boolean) = false) {
  const [open, onOpenChange] = useState(initialState)
  return {
    open,
    onOpenChange,
  }
}
