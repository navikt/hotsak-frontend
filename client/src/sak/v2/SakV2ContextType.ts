import { createContext, RefObject, useContext } from 'react'
import { HenleggFormHandle } from './behandling/HenleggForm'
import {
  PanelState,
  PanelAction,
  getVisiblePanels,
  getTotalVisibleMinWidth,
  initialPanelState,
} from './paneler/panelReducer'
import { VenstrekolonneTabs } from './SakPanelTabTypes'

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
  henleggFormRef: { current: null } as RefObject<HenleggFormHandle | null>,

  panelState: initialPanelState,
  panelDispatch: () => {},
  totalVisibleMinWidth: getTotalVisibleMinWidth(initialPanelState),
  visiblePanels: [],
  harFlerePanelerÅpne: false,
}

export const SakContext = createContext<SakV2ContextType>(initialState)
SakContext.displayName = 'SakV2'

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
  henleggFormRef: RefObject<HenleggFormHandle | null>
}

export type { SakV2ContextType }

export function useSakContext(): SakV2ContextType {
  const context = useContext(SakContext)

  if (!context) {
    throw new Error('useSakContext must be used within a SakProvider')
  }

  return context
}
