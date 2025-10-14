import { createContext, ReactNode, useContext, useState } from 'react'
import { HøyrekolonneTabs, VenstrekolonneTabs } from './SaksbehandlingEksperimentProviderTypes'

/**
 * Holder på instillinger og state for det som skjer i saksbehandlingsbildet i nye Hotsak. Ligger som en egen provider for ikke å blande det
 * med det som brukes i resten av Hotsak (og prod). Kan på sikt merges inn i OppgaveProvider?
 *
 */
const initialState = {
  venstreKolonne: false,
  setVenstreKolonne() {},
  midtreKolonne: false,
  setMidtreKolonne() {},
  høyreKolonne: false,
  setHøyreKolonne() {},
  valgtVenstreKolonneTab: VenstrekolonneTabs.BEHOVSMELDINGSINFO,
  setValgtVenstreKolonneTab() {},
  valgtHøyreKolonneTab: HøyrekolonneTabs.NOTATER,
  setValgtHøyreKolonneTab() {},
}

const SaksbehandlingEksperimentContext = createContext<SaksbehandlingEksperimentContextType>(initialState)
SaksbehandlingEksperimentContext.displayName = 'SaksbehandlingEksperiment'

function SaksbehandlingEksperimentProvider({ children }: { children: ReactNode }) {
  const [venstreKolonne, setVenstreKolonne] = useState(true)
  const [valgtVenstreKolonneTab, setValgtVenstreKolonneTab] = useState<VenstrekolonneTabs>(
    VenstrekolonneTabs.BEHOVSMELDINGSINFO
  )
  const [valgtHøyreKolonneTab, setValgtHøyreKolonneTab] = useState<HøyrekolonneTabs>(HøyrekolonneTabs.NOTATER)
  const [midtreKolonne, setMidtreKolonne] = useState(true)
  const [høyreKolonne, setHøyreKolonne] = useState(true)

  return (
    <SaksbehandlingEksperimentContext.Provider
      value={{
        venstreKolonne,
        setVenstreKolonne,
        midtreKolonne,
        setMidtreKolonne,
        valgtVenstreKolonneTab,
        setValgtVenstreKolonneTab,
        høyreKolonne,
        setHøyreKolonne,
        valgtHøyreKolonneTab,
        setValgtHøyreKolonneTab,
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

type SaksbehandlingEksperimentContextType = {
  venstreKolonne: boolean
  setVenstreKolonne(visible: boolean): void
  midtreKolonne: boolean
  setMidtreKolonne(visible: boolean): void
  høyreKolonne: boolean
  setHøyreKolonne(visible: boolean): void
  valgtVenstreKolonneTab: VenstrekolonneTabs
  setValgtVenstreKolonneTab(tab: VenstrekolonneTabs): void
  valgtHøyreKolonneTab: HøyrekolonneTabs
  setValgtHøyreKolonneTab(tab: HøyrekolonneTabs): void
}

export { SaksbehandlingEksperimentContext, SaksbehandlingEksperimentProvider, useSaksbehandlingEksperimentContext }
