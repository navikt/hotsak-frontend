import React, { useContext, useState } from 'react'

type PersonContextType = {
  fodselsnummer: string
  setFodselsnummer: (fødselsnummer: string) => void
}

const initialState = {
  fodselsnummer: '',
  setFodselsnummer: () => {},
}

const PersonContext = React.createContext<PersonContextType>(initialState)

const PersonProvider: React.FC = ({ children }) => {
  const [fodselsnummer, setFodselsnummer] = useState(initialState.fodselsnummer)

  return <PersonContext.Provider value={{ fodselsnummer, setFodselsnummer }}>{children}</PersonContext.Provider>
}

function usePersonContext(): PersonContextType {
  const context = useContext(PersonContext)

  if (!context) {
    throw new Error('usePersonContext must be used within a PersonProvider')
  }

  return context
}

export { PersonContext, PersonProvider, usePersonContext }
