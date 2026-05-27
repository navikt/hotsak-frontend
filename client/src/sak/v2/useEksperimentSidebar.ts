import { useCallback, useEffect, useRef, useState } from 'react'
import { usePanelCallbackRef, type PanelSize } from 'react-resizable-panels'
import { useMiljø } from '../../utils/useMiljø'

interface UseEksperimentSidebarOptions {
  sidePanelVisible: boolean
  sidePanelDefaultSize: string
  sidebarOpenDefaultSizeRequestId: number
}

export function useEksperimentSidebar(options: UseEksperimentSidebarOptions) {
  const { sidePanelVisible, sidePanelDefaultSize, sidebarOpenDefaultSizeRequestId } = options
  const { erProd } = useMiljø()
  const [sisteEksperimentSidebarBredde, setSisteEksperimentSidebarBredde] = useState<number | string>('20%')
  const [eksperimentSidebarPanel, setEksperimentSidebarPanel] = usePanelCallbackRef()
  const harInitialisertEksperimentSidebar = useRef(false)
  const sisteDefaultSizeRequestRef = useRef(0)

  useEffect(() => {
    if (erProd || !eksperimentSidebarPanel) {
      harInitialisertEksperimentSidebar.current = false
      sisteDefaultSizeRequestRef.current = sidebarOpenDefaultSizeRequestId
      return
    }

    const skalBrukeDefaultSize = sisteDefaultSizeRequestRef.current !== sidebarOpenDefaultSizeRequestId

    if (!harInitialisertEksperimentSidebar.current) {
      harInitialisertEksperimentSidebar.current = true
      sisteDefaultSizeRequestRef.current = sidebarOpenDefaultSizeRequestId

      if (!sidePanelVisible) {
        eksperimentSidebarPanel.collapse()
      }

      return
    }

    if (sidePanelVisible) {
      eksperimentSidebarPanel.resize(skalBrukeDefaultSize ? sidePanelDefaultSize : sisteEksperimentSidebarBredde)
    } else {
      eksperimentSidebarPanel.collapse()
    }

    sisteDefaultSizeRequestRef.current = sidebarOpenDefaultSizeRequestId
  }, [
    erProd,
    eksperimentSidebarPanel,
    sidePanelDefaultSize,
    sidePanelVisible,
    sidebarOpenDefaultSizeRequestId,
    sisteEksperimentSidebarBredde,
  ])

  const handleEksperimentSidebarResize = useCallback((panelSize: PanelSize) => {
    if (panelSize.inPixels > 0) {
      setSisteEksperimentSidebarBredde(panelSize.inPixels)
    }
  }, [])

  return {
    setEksperimentSidebarPanel,
    handleEksperimentSidebarResize,
  }
}
