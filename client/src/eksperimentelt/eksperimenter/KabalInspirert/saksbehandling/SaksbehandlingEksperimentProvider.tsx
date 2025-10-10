import { createContext, ReactNode, useContext, useState } from 'react'

type SaksbehandlingEksperimentContextType = {
  venstreKolonne: boolean
  setVenstreKolonne(visible: boolean): void
  midtreKolonne: boolean
  setMidtreKolonne(visible: boolean): void
  høyreKolonne: boolean
  setHøyreKolonne(visible: boolean): void
}

const initialState = {
  venstreKolonne: false,
  setVenstreKolonne() {},
  midtreKolonne: false,
  setMidtreKolonne() {},
  høyreKolonne: false,
  setHøyreKolonne() {},
}

/**
 * Holder på instillinger og state for det som skjer i saksbehandlingsbildet i nye Hotsak. Ligger som en egen provider for ikke å blande det
 * med det som brukes i resten av Hotsak (og prod). Kan på sikt merges inn i OppgaveProvider?
 */
const SaksbehandlingEksperimentContext = createContext<SaksbehandlingEksperimentContextType>(initialState)
SaksbehandlingEksperimentContext.displayName = 'SaksbehandlingEksperiment'

function SaksbehandlingEksperimentProvider({ children }: { children: ReactNode }) {
  const [venstreKolonne, setVenstreKolonne] = useState(true)
  const [midtreKolonne, setMidtreKolonne] = useState(true)
  const [høyreKolonne, setHøyreKolonne] = useState(true)

  return (
    <SaksbehandlingEksperimentContext.Provider
      value={{
        venstreKolonne,
        setVenstreKolonne,
        midtreKolonne,
        setMidtreKolonne,
        høyreKolonne,
        setHøyreKolonne,
      }}
    >
      {children}
    </SaksbehandlingEksperimentContext.Provider>
  )
}

function useSaksbehandlingEksperimentContext(): SaksbehandlingEksperimentContextType {
  const context = useContext(SaksbehandlingEksperimentContext)

  if (!context) {
    throw new Error('useSaksbehandlingEksperimentContext must be used within a SaksbehandlingEksperimentProvider')
  }

  return context
}

export { SaksbehandlingEksperimentContext, SaksbehandlingEksperimentProvider, useSaksbehandlingEksperimentContext }
