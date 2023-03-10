import React, { useContext, useState } from 'react'

import { HøyrekolonneTabs } from '../../types/types.internal'

type ManuellSaksbehandlingContextType = {
  valgtTab: string
  setValgtTab: (valgtTab: string) => void
  valgtSidebarTab: string
  setValgtSidebarTab: (valgtSidebareTab: string) => void
}

const initialState = {
  valgtTab: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setValgtTab: () => {},
  valgtSidebarTab: HøyrekolonneTabs.SAKSHISTORIKK.toString(),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setValgtSidebarTab: () => {},
}

const ManuellSaksbehandlingContext = React.createContext<ManuellSaksbehandlingContextType>(initialState)

const ManuellSaksbehandlingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [valgtTab, setValgtTab] = useState(initialState.valgtTab)
  const [valgtSidebarTab, setValgtSidebarTab] = useState(initialState.valgtSidebarTab)

  return (
    <ManuellSaksbehandlingContext.Provider value={{ valgtTab, setValgtTab, valgtSidebarTab, setValgtSidebarTab }}>
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
