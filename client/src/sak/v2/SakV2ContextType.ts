import { createContext, type Dispatch, type RefObject, useContext } from 'react'

import { type HenleggFormHandle } from './behandling/HenleggForm'
import {
  getTotalVisibleMinWidth,
  getVisiblePanels,
  initialPanelState,
  type PanelAction,
  type PanelState,
} from './paneler/panelReducer'
import { SidebarValg, VenstrekolonneTabs } from './SakPanelTabTypes'

/**
 * Holder på instillinger og state for det som skjer i saksbehandlingsbildet i nye Hotsak. Ligger som en egen provider for ikke å blande det
 * med det som brukes i resten av Hotsak (og prod). Kan på sikt merges inn i OppgaveProvider?
 *
 */
const initialState = {
  valgtNedreVenstreKolonneTab: VenstrekolonneTabs.BEHOVSMELDINGSINFO,
  setValgtNedreVenstreKolonneTab() {},
  aktivSidebar: SidebarValg.HJELPEMIDDELOVERSIKT,
  setAktivSidebar() {},
  sidebarOpenDefaultSizeRequestId: 0,
  henleggFormRef: { current: null } as RefObject<HenleggFormHandle | null>,
  panelState: initialPanelState,
  panelDispatch() {},
  totalVisibleMinWidth: getTotalVisibleMinWidth(initialPanelState),
  visiblePanels: [],
  harFlerePanelerÅpne: false,
}

export const SakContext = createContext<SakV2ContextType>(initialState)
SakContext.displayName = 'SakV2'

export interface SakV2ContextType {
  valgtNedreVenstreKolonneTab: VenstrekolonneTabs
  setValgtNedreVenstreKolonneTab(tab: VenstrekolonneTabs): void
  aktivSidebar: SidebarValg
  setAktivSidebar(sidebar: SidebarValg): void
  sidebarOpenDefaultSizeRequestId: number
  henleggFormRef: RefObject<HenleggFormHandle | null>
  panelState: PanelState
  panelDispatch: Dispatch<PanelAction>
  totalVisibleMinWidth: number
  visiblePanels: ReturnType<typeof getVisiblePanels>
  harFlerePanelerÅpne: boolean
}

export function useSakContext(): SakV2ContextType {
  const context = useContext(SakContext)

  if (!context) {
    throw new Error('useSakContext must be used within a SakProvider')
  }

  return context
}
