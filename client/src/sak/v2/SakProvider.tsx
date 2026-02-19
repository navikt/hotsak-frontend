import { createContext, ReactNode, useContext, useMemo, useReducer, useState } from 'react'
import { HøyrekolonneTabs, VenstrekolonneTabs } from './SakPanelTabTypes'
import {
  getVisiblePanels,
  hasMultiplePanelsOpen,
  initialPanelState,
  PanelAction,
  PanelId,
  panelReducer,
  PanelState,
  getTotalVisibleMinWidth,
} from './paneler/panelReducer'

/**
 * Holder på instillinger og state for det som skjer i saksbehandlingsbildet i nye Hotsak. Ligger som en egen provider for ikke å blande det
 * med det som brukes i resten av Hotsak (og prod). Kan på sikt merges inn i OppgaveProvider?
 *
 */
const initialState = {
  //setSidePanel() {},
  //søknadPanel: false,
  //setSøknadPanel() {},
  //behandlingPanel: false,
  //setBehandlingPanel() {},
  //brevKolonne: false,
  //setBrevKolonne() {},
  valgtNedreVenstreKolonneTab: VenstrekolonneTabs.BEHOVSMELDINGSINFO,
  setValgtNedreVenstreKolonneTab() {},
  valgtHøyreKolonneTab: HøyrekolonneTabs.NOTATER,
  setValgtHøyreKolonneTab() {},
  opprettBrevKlikket: false,
  setOpprettBrevKlikket() {},

  panelState: initialPanelState,
  panelDispatch: () => {},
  totalVisibleMinWidth: getTotalVisibleMinWidth(initialPanelState),
  visiblePanels: [],
  harFlerePanelerÅpne: false,
}

const SakContext = createContext<SakV2ContextType>(initialState)
SakContext.displayName = 'SakV2'

function SakProvider({ children }: { children: ReactNode }) {
  const [panelState, panelDispatch] = useReducer(panelReducer, initialPanelState)
  const [valgtNedreVenstreKolonneTab, setValgtNedreVenstreKolonneTab] = useState<VenstrekolonneTabs>(
    VenstrekolonneTabs.HJELPEMIDDELOVERSIKT
  )
  const [valgtHøyreKolonneTab, setValgtHøyreKolonneTab] = useState<HøyrekolonneTabs>(HøyrekolonneTabs.NOTATER)
  const [opprettBrevKlikket, setOpprettBrevKlikket] = useState(false)

  const totalVisibleMinWidth = useMemo(() => getTotalVisibleMinWidth(panelState), [panelState])
  const visiblePanels = useMemo(() => getVisiblePanels(panelState), [panelState])
  const harFlerePanelerÅpne = useMemo(() => hasMultiplePanelsOpen(panelState), [panelState])

  return (
    <SakContext.Provider
      value={{
        valgtNedreVenstreKolonneTab,
        setValgtNedreVenstreKolonneTab,
        panelState,
        panelDispatch,
        totalVisibleMinWidth,
        visiblePanels,
        harFlerePanelerÅpne,
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

function useSakContext(): SakV2ContextType {
  const context = useContext(SakContext)

  if (!context) {
    throw new Error('useSakContext must be used within a SakProvider')
  }

  return context
}

export function usePanel(panelId: PanelId) {
  const { panelState } = useSakContext()
  return panelState.panels[panelId]
}

export function useTogglePanel(panelId: PanelId) {
  const { panelDispatch } = useSakContext()
  return () => panelDispatch({ type: 'TOGGLE_PANEL', panelId })
}

export function useClosePanel(panelId: PanelId) {
  const { panelDispatch } = useSakContext()
  return () => panelDispatch({ type: 'SET_PANEL_VISIBILITY', panelId, visible: false })
}

export function useSetPanelVisibility(panelId: PanelId) {
  const { panelDispatch } = useSakContext()
  return (visible: boolean) => panelDispatch({ type: 'SET_PANEL_VISIBILITY', panelId, visible })
}

type SakV2ContextType = {
  valgtNedreVenstreKolonneTab: VenstrekolonneTabs
  setValgtNedreVenstreKolonneTab(tab: VenstrekolonneTabs): void
  panelState: PanelState
  panelDispatch: React.Dispatch<PanelAction>
  totalVisibleMinWidth: number
  visiblePanels: ReturnType<typeof getVisiblePanels>
  harFlerePanelerÅpne: boolean
  valgtHøyreKolonneTab: HøyrekolonneTabs
  setValgtHøyreKolonneTab(tab: HøyrekolonneTabs): void
  opprettBrevKlikket: boolean
  setOpprettBrevKlikket(klikket: boolean): void
}

export { SakContext, SakProvider, useSakContext }
