import React, { useContext, useState } from 'react'

type ManuellSaksbehandlingContextType = {
  valgtTab: string
  setValgtTab: (valgtTab: string) => void
}

const initialState = {
  valgtTab: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setValgtTab: () => {},
}

const ManuellSaksbehandlingContext = React.createContext<ManuellSaksbehandlingContextType>(initialState)

const ManuellSaksbehandlingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [valgtTab, setValgtTab] = useState(initialState.valgtTab)

  return (
    <ManuellSaksbehandlingContext.Provider value={{ valgtTab, setValgtTab }}>
      {children}
    </ManuellSaksbehandlingContext.Provider>
  )
}

function useManuellSaksbehandlingContext(): ManuellSaksbehandlingContextType {
  const context = useContext(ManuellSaksbehandlingContext)

  if (!context) {
    throw new Error('useDokumentContext must be used within a DokumentProvider')
  }

  return context
}

export { ManuellSaksbehandlingContext, ManuellSaksbehandlingProvider, useManuellSaksbehandlingContext }
