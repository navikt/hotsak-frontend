import { createContext, ReactNode, useContext, useState } from 'react'
import { HøyrekolonneTabs, VenstrekolonneTabs } from './SaksbehandlingEksperimentProviderTypes'

/**
 * Holder på instillinger og state for det som skjer i saksbehandlingsbildet i nye Hotsak. Ligger som en egen provider for ikke å blande det
 * med det som brukes i resten av Hotsak (og prod). Kan på sikt merges inn i OppgaveProvider?
 *
 */
const initialState = {
  sidePanel: false,
  setSidePanel() {},
  søknadPanel: false,
  setSøknadPanel() {},
  behandlingPanel: false,
  setBehandlingPanel() {},
  brevKolonne: false,
  setBrevKolonne() {},
  valgtNedreVenstreKolonneTab: VenstrekolonneTabs.BEHOVSMELDINGSINFO,
  setValgtNedreVenstreKolonneTab() {},
  valgtHøyreKolonneTab: HøyrekolonneTabs.NOTATER,
  setValgtHøyreKolonneTab() {},
  opprettBrevKlikket: false,
  setOpprettBrevKlikket() {},
}

const SakContext = createContext<SaksbehandlingEksperimentContextType>(initialState)
SakContext.displayName = 'SaksbehandlingEksperiment'

function SakProvider({ children }: { children: ReactNode }) {
  const [sidePanel, setSidePanel] = useState(true)
  const [valgtNedreVenstreKolonneTab, setValgtNedreVenstreKolonneTab] = useState<VenstrekolonneTabs>(
    VenstrekolonneTabs.HJELPEMIDDELOVERSIKT
  )
  const [valgtHøyreKolonneTab, setValgtHøyreKolonneTab] = useState<HøyrekolonneTabs>(HøyrekolonneTabs.NOTATER)
  const [søknadPanel, setSøknadPanel] = useState(true)
  const [behandlingPanel, setBehandlingPanel] = useState(true)
  const [brevKolonne, setBrevKolonne] = useState(false)
  const [opprettBrevKlikket, setOpprettBrevKlikket] = useState(false)

  return (
    <SakContext.Provider
      value={{
        sidePanel,
        setSidePanel,
        søknadPanel,
        setSøknadPanel,
        valgtNedreVenstreKolonneTab,
        setValgtNedreVenstreKolonneTab,
        behandlingPanel,
        setBehandlingPanel,
        brevKolonne,
        setBrevKolonne,
        valgtHøyreKolonneTab,
        setValgtHøyreKolonneTab,
        opprettBrevKlikket,
        setOpprettBrevKlikket,
      }}
    >
      {children}
    </SakContext.Provider>
  )
}

function useSaksbehandlingEksperimentContext(): SaksbehandlingEksperimentContextType {
  const context = useContext(SakContext)

  if (!context) {
    throw new Error('useSaksbehandlingEksperimentContext must be used within a SaksbehandlingEksperimentProvider')
  }

  return context
}

type SaksbehandlingEksperimentContextType = {
  sidePanel: boolean
  setSidePanel(visible: boolean): void
  søknadPanel: boolean
  setSøknadPanel(visible: boolean): void
  brevKolonne: boolean
  setBrevKolonne(visible: boolean): void
  behandlingPanel: boolean
  setBehandlingPanel(visible: boolean): void
  valgtNedreVenstreKolonneTab: VenstrekolonneTabs
  setValgtNedreVenstreKolonneTab(tab: VenstrekolonneTabs): void
  valgtHøyreKolonneTab: HøyrekolonneTabs
  setValgtHøyreKolonneTab(tab: HøyrekolonneTabs): void
  opprettBrevKlikket: boolean
  setOpprettBrevKlikket(klikket: boolean): void
}

export { SakContext, SakProvider, useSaksbehandlingEksperimentContext }
