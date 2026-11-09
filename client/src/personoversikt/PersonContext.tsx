import { createContext, type Dispatch, type ReactNode, type SetStateAction, useContext, useMemo, useState } from 'react'
import { useLocation } from 'react-router'

interface PersonContextType {
  fodselsnummer: string
  setFodselsnummer: Dispatch<SetStateAction<string>>
}

const initialState: PersonContextType = {
  fodselsnummer: '',
  setFodselsnummer() {},
}

export const PersonContext = createContext<PersonContextType>(initialState)
PersonContext.displayName = 'Person'

export function PersonProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const fnr = new URLSearchParams(location.search).get('fnr') ?? initialState.fodselsnummer
  const [fodselsnummer, setFodselsnummer] = useState(fnr)
  const value = useMemo(() => ({ fodselsnummer, setFodselsnummer }), [fodselsnummer])
  return <PersonContext value={value}>{children}</PersonContext>
}

export function usePersonContext(): PersonContextType {
  const context = useContext(PersonContext)
  if (!context) {
    throw new Error('usePersonContext must be used within a PersonProvider')
  }
  return context
}
