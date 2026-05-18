import { ReactNode, useMemo, useReducer, useRef, useState } from 'react'
import { HenleggFormHandle } from './behandling/HenleggForm'
import {
  getTotalVisibleMinWidth,
  getVisiblePanels,
  hasMultiplePanelsOpen,
  initialPanelState,
  panelReducer,
} from './paneler/panelReducer'
import { VenstrekolonneTabs } from './SakPanelTabTypes'
import { SakContext } from './SakV2ContextType'

function SakProvider({ children }: { children: ReactNode }) {
  const [panelState, panelDispatch] = useReducer(panelReducer, initialPanelState)
  const [valgtNedreVenstreKolonneTab, setValgtNedreVenstreKolonneTab] = useState<VenstrekolonneTabs>(
    VenstrekolonneTabs.HJELPEMIDDELOVERSIKT
  )
  const [opprettBrevKlikket, setOpprettBrevKlikket] = useState(false)
  const henleggFormRef = useRef<HenleggFormHandle>(null)

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
        henleggFormRef,
      }}
    >
      {children}
    </SakContext.Provider>
  )
}

export { SakProvider }
