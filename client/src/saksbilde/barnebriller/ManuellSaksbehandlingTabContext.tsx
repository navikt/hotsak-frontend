import React, { useContext, useState } from 'react'

import { HøyrekolonneTabs, StepType } from '../../types/types.internal'

type ManuellSaksbehandlingContextType = {
  step: number
  setStep: (steg: number) => void
  valgtSidebarTab: string
  setValgtSidebarTab: (valgtSidebareTab: string) => void
}

const initialState = {
  step: StepType.REGISTRER,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setStep: () => {},
  valgtSidebarTab: HøyrekolonneTabs.SAKSHISTORIKK.toString(),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setValgtSidebarTab: () => {},
}

const ManuellSaksbehandlingContext = React.createContext<ManuellSaksbehandlingContextType>(initialState)

const ManuellSaksbehandlingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [valgtSidebarTab, setValgtSidebarTab] = useState(initialState.valgtSidebarTab)
  const [step, setStep] = useState(initialState.step)

  return (
    <ManuellSaksbehandlingContext.Provider value={{ step, setStep, valgtSidebarTab, setValgtSidebarTab }}>
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
