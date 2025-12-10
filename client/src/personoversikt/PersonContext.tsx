import { createContext, type ReactNode, useContext, useState } from 'react'

interface PersonContextType {
  fodselsnummer: string
  setFodselsnummer(fødselsnummer: string): void
}

const initialState = {
  fodselsnummer: '',
  setFodselsnummer() {},
}

const PersonContext = createContext<PersonContextType>(initialState)
PersonContext.displayName = 'Person'

function PersonProvider({ children }: { children: ReactNode }) {
  const [fodselsnummer, setFodselsnummer] = useState(initialState.fodselsnummer)
  return <PersonContext value={{ fodselsnummer, setFodselsnummer }}>{children}</PersonContext>
}

function usePersonContext(): PersonContextType {
  const context = useContext(PersonContext)
  if (!context) {
    throw new Error('usePersonContext must be used within a PersonProvider')
  }
  return context
}

export { PersonContext, PersonProvider, usePersonContext }
