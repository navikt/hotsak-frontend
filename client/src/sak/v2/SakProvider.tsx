import { createContext, ReactNode, useContext, useMemo, useReducer, useState } from 'react'
import { VenstrekolonneTabs } from './SakPanelTabTypes'
import {
  getTotalVisibleMinWidth,
  getVisiblePanels,
  hasMultiplePanelsOpen,
  initialPanelState,
  PanelAction,
  panelReducer,
  PanelState,
} from './paneler/panelReducer'

/**
 * Holder på instillinger og state for det som skjer i saksbehandlingsbildet i nye Hotsak. Ligger som en egen provider for ikke å blande det
 * med det som brukes i resten av Hotsak (og prod). Kan på sikt merges inn i OppgaveProvider?
 *
 */
const initialState = {
  valgtNedreVenstreKolonneTab: VenstrekolonneTabs.BEHOVSMELDINGSINFO,
  setValgtNedreVenstreKolonneTab() {},
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

type SakV2ContextType = {
  valgtNedreVenstreKolonneTab: VenstrekolonneTabs
  setValgtNedreVenstreKolonneTab(tab: VenstrekolonneTabs): void
  panelState: PanelState
  panelDispatch: React.Dispatch<PanelAction>
  totalVisibleMinWidth: number
  visiblePanels: ReturnType<typeof getVisiblePanels>
  harFlerePanelerÅpne: boolean
  opprettBrevKlikket: boolean
  setOpprettBrevKlikket(klikket: boolean): void
}

export { SakProvider, useSakContext }
export type { SakV2ContextType }
