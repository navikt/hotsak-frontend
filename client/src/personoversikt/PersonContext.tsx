import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react'

const KEY = 'dev:fnr'
const LAGRE = import.meta.env.DEV && typeof window !== 'undefined'

interface PersonContextType {
  fodselsnummer: string
  setFodselsnummer: (fnr: string) => void
}

export const PersonContext = createContext<PersonContextType | null>(null)
PersonContext.displayName = 'Person'

export function PersonProvider({ children }: { children: ReactNode }) {
  const [fodselsnummer, setState] = useState(() => (LAGRE && sessionStorage.getItem(KEY)) || '')

  const setFodselsnummer = useCallback((fnr: string) => {
    setState(fnr)
    if (LAGRE) {
      if (fnr) sessionStorage.setItem(KEY, fnr)
      else sessionStorage.removeItem(KEY)
    }
  }, [])

  const value = useMemo(() => ({ fodselsnummer, setFodselsnummer }), [fodselsnummer, setFodselsnummer])
  return <PersonContext value={value}>{children}</PersonContext>
}

export function usePersonContext() {
  const context = useContext(PersonContext)
  if (!context) throw new Error('usePersonContext must be used within a PersonProvider')
  return context
}
