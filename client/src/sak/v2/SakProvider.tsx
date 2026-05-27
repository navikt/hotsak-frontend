import { ReactNode, useMemo, useReducer, useRef, useState } from 'react'
import { HenleggFormHandle } from './behandling/HenleggForm'
import {
  getTotalVisibleMinWidth,
  getVisiblePanels,
  hasMultiplePanelsOpen,
  initialPanelState,
  panelReducer,
} from './paneler/panelReducer'
import { SidebarValg, VenstrekolonneTabs } from './SakPanelTabTypes'
import { SakContext } from './SakV2ContextType'

function SakProvider({ children }: { children: ReactNode }) {
  const [panelState, panelDispatch] = useReducer(panelReducer, initialPanelState)
  const [valgtNedreVenstreKolonneTab, setValgtNedreVenstreKolonneTab] = useState<VenstrekolonneTabs>(
    VenstrekolonneTabs.HJELPEMIDDELOVERSIKT
  )
  const [aktivSidebar, setAktivSidebarState] = useState<SidebarValg>(SidebarValg.HJELPEMIDDELOVERSIKT)
  const [sidebarOpenDefaultSizeRequestId, setSidebarOpenDefaultSizeRequestId] = useState(0)
  const [opprettBrevKlikket, setOpprettBrevKlikket] = useState(false)
  const henleggFormRef = useRef<HenleggFormHandle>(null)

  function setAktivSidebar(sidebar: SidebarValg) {
    setAktivSidebarState(sidebar)
    if (!panelState.panels.sidebarpanel.visible) {
      setSidebarOpenDefaultSizeRequestId((current) => current + 1)
    }
    panelDispatch({ type: 'SET_PANEL_VISIBILITY', panelId: 'sidebarpanel', visible: true })
  }

  const totalVisibleMinWidth = useMemo(() => getTotalVisibleMinWidth(panelState), [panelState])
  const visiblePanels = useMemo(() => getVisiblePanels(panelState), [panelState])
  const harFlerePanelerÅpne = useMemo(() => hasMultiplePanelsOpen(panelState), [panelState])

  return (
    <SakContext.Provider
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
        opprettBrevKlikket,
        setOpprettBrevKlikket,
        henleggFormRef,
      }}
    >
      {children}
    </SakContext.Provider>
  )
}

export { SakProvider }
