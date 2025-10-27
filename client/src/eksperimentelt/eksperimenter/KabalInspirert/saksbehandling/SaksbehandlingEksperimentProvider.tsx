import { createContext, ReactNode, useContext, useState } from 'react'
import { HøyrekolonneTabs, VenstrekolonneTabs } from './SaksbehandlingEksperimentProviderTypes'

/**
 * Holder på instillinger og state for det som skjer i saksbehandlingsbildet i nye Hotsak. Ligger som en egen provider for ikke å blande det
 * med det som brukes i resten av Hotsak (og prod). Kan på sikt merges inn i OppgaveProvider?
 *
 */
const initialState = {
  venstrePanel: false,
  setVenstrePanel() {},
  søknadPanel: false,
  setSøknadPanel() {},
  vilkårPanel: false,
  setVilkårPanel() {},
  brevKolonne: false,
  setBrevKolonne() {},
  valgtØvreVenstreKolonneTab: VenstrekolonneTabs.BEHOVSMELDINGSINFO,
  setValgtØvreVenstreKolonneTab() {},
  valgtNedreVenstreKolonneTab: VenstrekolonneTabs.BEHOVSMELDINGSINFO,
  setValgtNedreVenstreKolonneTab() {},
  valgtHøyreKolonneTab: HøyrekolonneTabs.NOTATER,
  setValgtHøyreKolonneTab() {},
}

const SaksbehandlingEksperimentContext = createContext<SaksbehandlingEksperimentContextType>(initialState)
SaksbehandlingEksperimentContext.displayName = 'SaksbehandlingEksperiment'

function SaksbehandlingEksperimentProvider({ children }: { children: ReactNode }) {
  const [venstrePanel, setVenstrePanel] = useState(true)
  const [valgtØvreVenstreKolonneTab, setValgtØvreVenstreKolonneTab] = useState<VenstrekolonneTabs>(
    VenstrekolonneTabs.BEHOVSMELDINGSINFO
  )
  const [valgtNedreVenstreKolonneTab, setValgtNedreVenstreKolonneTab] = useState<VenstrekolonneTabs>(
    VenstrekolonneTabs.HJELPEMIDDELOVERSIKT
  )
  const [valgtHøyreKolonneTab, setValgtHøyreKolonneTab] = useState<HøyrekolonneTabs>(HøyrekolonneTabs.NOTATER)
  const [søknadPanel, setSøknadPanel] = useState(true)
  const [vilkårPanel, setVilkårPanel] = useState(false)
  const [brevKolonne, setBrevKolonne] = useState(true)

  return (
    <SaksbehandlingEksperimentContext.Provider
      value={{
        venstrePanel,
        setVenstrePanel,
        søknadPanel,
        setSøknadPanel,
        valgtØvreVenstreKolonneTab,
        setValgtØvreVenstreKolonneTab,
        valgtNedreVenstreKolonneTab,
        setValgtNedreVenstreKolonneTab,
        vilkårPanel,
        setVilkårPanel,
        brevKolonne,
        setBrevKolonne,
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
  venstrePanel: boolean
  setVenstrePanel(visible: boolean): void
  søknadPanel: boolean
  setSøknadPanel(visible: boolean): void
  brevKolonne: boolean
  setBrevKolonne(visible: boolean): void
  vilkårPanel: boolean
  setVilkårPanel(visible: boolean): void
  valgtØvreVenstreKolonneTab: VenstrekolonneTabs
  setValgtØvreVenstreKolonneTab(tab: VenstrekolonneTabs): void
  valgtNedreVenstreKolonneTab: VenstrekolonneTabs
  setValgtNedreVenstreKolonneTab(tab: VenstrekolonneTabs): void
  valgtHøyreKolonneTab: HøyrekolonneTabs
  setValgtHøyreKolonneTab(tab: HøyrekolonneTabs): void
}

export { SaksbehandlingEksperimentContext, SaksbehandlingEksperimentProvider, useSaksbehandlingEksperimentContext }
