import { useEffect, useRef } from 'react'

import type { HotkeyDefinition } from './hotkeys.ts'

export function useHotkey(
  hotkey: HotkeyDefinition,
  handler: (e: KeyboardEvent) => void,
  options?: { enabled?: boolean; skipInInputFields?: boolean }
) {
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  })

  const enabled = options?.enabled ?? true
  const skipInInputFields = options?.skipInInputFields ?? false

  useEffect(() => {
    if (!enabled) return

    function isInputFocused() {
      const el = document.activeElement
      if (!el) return false
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
        return true
      }
      return (el as HTMLElement).isContentEditable
    }

    function onKeyDown(e: KeyboardEvent) {
      if (skipInInputFields && isInputFocused()) return

      const matchesKey = e.code === hotkey.code
      const matchesAlt = !!hotkey.alt === e.altKey
      const matchesCtrl = !!hotkey.ctrl === e.ctrlKey
      const matchesShift = !!hotkey.shift === e.shiftKey
      const matchesMeta = !!hotkey.meta === e.metaKey

      if (matchesKey && matchesAlt && matchesCtrl && matchesShift && matchesMeta) {
        e.preventDefault()
        handlerRef.current(e)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [hotkey.code, hotkey.alt, hotkey.ctrl, hotkey.shift, hotkey.meta, enabled, skipInInputFields])
}
