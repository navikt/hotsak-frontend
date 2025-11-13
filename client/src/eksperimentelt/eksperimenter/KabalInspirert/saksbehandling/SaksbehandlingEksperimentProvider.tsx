import { createContext, ReactNode, useContext, useState } from 'react'
import { HøyrekolonneTabs, SøknadPanelTabs, VenstrekolonneTabs } from './SaksbehandlingEksperimentProviderTypes'

export enum VedtaksResultat {
  IKKE_SATT = 'IKKE_SATT',
  INNVILGET = 'INNVILGET',
  AVSLÅTT = 'AVSLÅTT',
  DELVIS_INNVILGET = 'DELVIS_INNVILGET',
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
  vedtaksResultat: VedtaksResultat.IKKE_SATT,
  setVedtaksResultat() {},
  lagretResultat: false,
  setLagretResultat() {},
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
  const [vedtaksResultat, setVedtaksResultat] = useState<VedtaksResultat>(VedtaksResultat.IKKE_SATT)
  const [lagretResultat, setLagretResultat] = useState<boolean>(false)

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
  vedtaksResultat: VedtaksResultat
  setVedtaksResultat(vedtaksResultat: VedtaksResultat): void
  lagretResultat: boolean
  setLagretResultat(lagret: boolean): void
}

export { SaksbehandlingEksperimentContext, SaksbehandlingEksperimentProvider, useSaksbehandlingEksperimentContext }
