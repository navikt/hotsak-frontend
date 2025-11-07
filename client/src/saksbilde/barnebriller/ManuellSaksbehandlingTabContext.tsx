import { createContext, ReactNode, useContext, useState } from 'react'

import { HøyrekolonneTabs, StepType } from '../../types/types.internal'
import { useValgtFane } from '../useValgtFane.ts'

type ManuellSaksbehandlingContextType = {
  step: number
  setStep(steg: number): void
  valgtSidebarTab: HøyrekolonneTabs
  setValgtSidebarTab(valgtSidebarTab: string): void
}

const initialState = {
  step: StepType.REGISTRER,
  setStep() {},
  valgtSidebarTab: HøyrekolonneTabs.SAKSHISTORIKK,
  setValgtSidebarTab() {},
}

const ManuellSaksbehandlingContext = createContext<ManuellSaksbehandlingContextType>(initialState)
ManuellSaksbehandlingContext.displayName = 'ManuellSaksbehandling'

function ManuellSaksbehandlingProvider({ children }: { children: ReactNode }) {
  const [valgtSidebarTab, setValgtSidebarTab] = useValgtFane(initialState.valgtSidebarTab)
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
