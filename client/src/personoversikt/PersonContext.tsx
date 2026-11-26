import { createContext, useContext } from 'react'

interface PersonContextType {
  fodselsnummer: string
  setFodselsnummer: (fnr: string) => void
}

export const PersonContext = createContext<PersonContextType | null>(null)
PersonContext.displayName = 'Person'

export function usePersonContext() {
  const context = useContext(PersonContext)
  if (!context) throw new Error('usePersonContext must be used within a PersonProvider')
  return context
}
