import { type ReactNode, useCallback, useMemo, useReducer, useRef, useState } from 'react'

import { Sakstype } from '../../types/types.internal'
import { type HenleggFormHandle } from './behandling/HenleggForm'
import {
  createInitialPanelState,
  getTotalVisibleMinWidth,
  getVisiblePanels,
  hasMultiplePanelsOpen,
  panelReducer,
} from './paneler/panelReducer'
import { SidebarValg, VenstrekolonneTabs } from './SakPanelTabTypes'
import { SakContext } from './SakV2ContextType'

export function SakProvider({ children, sakstype }: { children: ReactNode; sakstype: Sakstype }) {
  const [panelState, panelDispatch] = useReducer(panelReducer, sakstype, createInitialPanelState)
  const [valgtNedreVenstreKolonneTab, setValgtNedreVenstreKolonneTab] = useState<VenstrekolonneTabs>(
    VenstrekolonneTabs.HJELPEMIDDELOVERSIKT
  )
  const [aktivSidebar, setAktivSidebarState] = useState<SidebarValg>(SidebarValg.HJELPEMIDDELOVERSIKT)
  const [sidebarOpenDefaultSizeRequestId, setSidebarOpenDefaultSizeRequestId] = useState(0)
  const henleggFormRef = useRef<HenleggFormHandle>(null)

  const setAktivSidebar = useCallback(
    (sidebar: SidebarValg) => {
      setAktivSidebarState(sidebar)
      if (!panelState.panels.sidebarpanel.visible) {
        setSidebarOpenDefaultSizeRequestId((current) => current + 1)
      }
      panelDispatch({ type: 'SET_PANEL_VISIBILITY', panelId: 'sidebarpanel', visible: true })
    },
    [panelState.panels.sidebarpanel.visible]
  )

  const totalVisibleMinWidth = useMemo(() => getTotalVisibleMinWidth(panelState), [panelState])
  const visiblePanels = useMemo(() => getVisiblePanels(panelState), [panelState])
  const harFlerePanelerÅpne = useMemo(() => hasMultiplePanelsOpen(panelState), [panelState])

  return (
    <SakContext
      value={{
        valgtNedreVenstreKolonneTab,
        setValgtNedreVenstreKolonneTab,
        aktivSidebar,
        setAktivSidebar,
        sidebarOpenDefaultSizeRequestId,
        panelState,
        panelDispatch,
        totalVisibleMinWidth,
        visiblePanels,
        harFlerePanelerÅpne,
        henleggFormRef,
      }}
    >
      {children}
    </SakContext>
  )
}
