import { createContext, ReactNode, useContext, useState } from 'react'
import { HøyrekolonneTabs, SøknadPanelTabs, VenstrekolonneTabs } from './SaksbehandlingEksperimentProviderTypes'

export enum VedtaksResultat {
  INNVILGET = 'INNVILGET',
  AVSLÅTT = 'AVSLÅTT',
  DELVIS_INNVILGET = 'DELVIS_INNVILGET',
  HENLAGT = 'HENLAGT',
}

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
  valgtSøknadPanelTab: SøknadPanelTabs.SØKNAD,
  setValgtSøknadPanelTab() {},
  valgtNedreVenstreKolonneTab: VenstrekolonneTabs.BEHOVSMELDINGSINFO,
  setValgtNedreVenstreKolonneTab() {},
  valgtHøyreKolonneTab: HøyrekolonneTabs.NOTATER,
  setValgtHøyreKolonneTab() {},
  vedtaksResultat: undefined,
  setVedtaksResultat() {},
  lagretResultat: false,
  setLagretResultat() {},
  oppgaveFerdigstilt: false,
  setOppgaveFerdigstilt() {},
  opprettBrevKlikket: false,
  setOpprettBrevKlikket() {},
  brevEksisterer: false,
  setBrevEksisterer() {},
  brevFerdigstilt: false,
  setBrevFerdigstilt() {},
}

const SaksbehandlingEksperimentContext = createContext<SaksbehandlingEksperimentContextType>(initialState)
SaksbehandlingEksperimentContext.displayName = 'SaksbehandlingEksperiment'

function SaksbehandlingEksperimentProvider({ children }: { children: ReactNode }) {
  const [sidePanel, setSidePanel] = useState(true)
  const [valgtNedreVenstreKolonneTab, setValgtNedreVenstreKolonneTab] = useState<VenstrekolonneTabs>(
    VenstrekolonneTabs.HJELPEMIDDELOVERSIKT
  )
  const [valgtHøyreKolonneTab, setValgtHøyreKolonneTab] = useState<HøyrekolonneTabs>(HøyrekolonneTabs.NOTATER)
  const [valgtSøknadPanelTab, setValgtSøknadPanelTab] = useState<SøknadPanelTabs>(SøknadPanelTabs.SØKNAD)
  const [søknadPanel, setSøknadPanel] = useState(true)
  const [behandlingPanel, setBehandlingPanel] = useState(true)
  const [brevKolonne, setBrevKolonne] = useState(false)
  const [vedtaksResultat, setVedtaksResultat] = useState<VedtaksResultat | undefined>()
  const [lagretResultat, setLagretResultat] = useState<boolean>(false)
  const [oppgaveFerdigstilt, setOppgaveFerdigstilt] = useState<boolean>(false)
  const [opprettBrevKlikket, setOpprettBrevKlikket] = useState(false)
  const [brevEksisterer, setBrevEksisterer] = useState<boolean>(false)
  const [brevFerdigstilt, setBrevFerdigstilt] = useState<boolean>(false)

  return (
    <SaksbehandlingEksperimentContext.Provider
      value={{
        sidePanel,
        setSidePanel,
        søknadPanel,
        setSøknadPanel,
        valgtNedreVenstreKolonneTab,
        setValgtNedreVenstreKolonneTab,
        valgtSøknadPanelTab,
        setValgtSøknadPanelTab,
        behandlingPanel,
        setBehandlingPanel,
        brevKolonne,
        setBrevKolonne,
        valgtHøyreKolonneTab,
        setValgtHøyreKolonneTab,
        vedtaksResultat,
        setVedtaksResultat,
        lagretResultat,
        setLagretResultat,
        oppgaveFerdigstilt,
        setOppgaveFerdigstilt,
        opprettBrevKlikket,
        setOpprettBrevKlikket,
        brevEksisterer,
        setBrevEksisterer,
        brevFerdigstilt,
        setBrevFerdigstilt,
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
  valgtSøknadPanelTab: SøknadPanelTabs
  setValgtSøknadPanelTab(tab: SøknadPanelTabs): void
  valgtHøyreKolonneTab: HøyrekolonneTabs
  setValgtHøyreKolonneTab(tab: HøyrekolonneTabs): void

  // Verdiene under er midlertidige tilstander for å teste flyt i prototypen før vi lager apiene
  vedtaksResultat?: VedtaksResultat
  setVedtaksResultat(vedtaksResultat: VedtaksResultat): void
  lagretResultat: boolean
  setLagretResultat(lagret: boolean): void
  oppgaveFerdigstilt: boolean
  setOppgaveFerdigstilt(ferdigstilt: boolean): void
  opprettBrevKlikket: boolean
  setOpprettBrevKlikket(klikket: boolean): void
  brevEksisterer: boolean
  setBrevEksisterer(eksisterer: boolean): void
  brevFerdigstilt: boolean
  setBrevFerdigstilt(ferdigstilt: boolean): void
}

export { SaksbehandlingEksperimentContext, SaksbehandlingEksperimentProvider, useSaksbehandlingEksperimentContext }
