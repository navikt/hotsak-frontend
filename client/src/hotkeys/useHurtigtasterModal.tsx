import { useState } from 'react'

export function useHurtigtasterModal() {
  const [open, setOpen] = useState(false)
  return { open, åpne: () => setOpen(true), lukk: () => setOpen(false) }
}
