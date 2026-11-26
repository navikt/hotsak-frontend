import { useCallback, useEffect, useRef, useState } from 'react'
import { usePanelCallbackRef, type PanelSize } from 'react-resizable-panels'

interface UseSidebarOptions {
  sidePanelVisible: boolean
  sidePanelDefaultSize: string
  sidebarOpenDefaultSizeRequestId: number
}

export function useSidebar(options: UseSidebarOptions) {
  const { sidePanelVisible, sidePanelDefaultSize, sidebarOpenDefaultSizeRequestId } = options

  const [sisteSidebarBredde, setSisteSidebarBredde] = useState<number | string>('20%')
  const [sidebarPanel, setSidebarPanel] = usePanelCallbackRef()
  const harInitialisertSidebar = useRef(false)
  const sisteDefaultSizeRequestRef = useRef(0)

  useEffect(() => {
    if (!sidebarPanel) {
      harInitialisertSidebar.current = false
      sisteDefaultSizeRequestRef.current = sidebarOpenDefaultSizeRequestId
      return
    }

    const skalBrukeDefaultSize = sisteDefaultSizeRequestRef.current !== sidebarOpenDefaultSizeRequestId

    if (!harInitialisertSidebar.current) {
      harInitialisertSidebar.current = true
      sisteDefaultSizeRequestRef.current = sidebarOpenDefaultSizeRequestId

      if (!sidePanelVisible) {
        sidebarPanel.collapse()
      }

      return
    }

    if (sidePanelVisible) {
      sidebarPanel.resize(skalBrukeDefaultSize ? sidePanelDefaultSize : sisteSidebarBredde)
    } else {
      sidebarPanel.collapse()
    }

    sisteDefaultSizeRequestRef.current = sidebarOpenDefaultSizeRequestId
  }, [sidebarPanel, sidePanelDefaultSize, sidePanelVisible, sidebarOpenDefaultSizeRequestId, sisteSidebarBredde])

  const handleSidebarResize = useCallback((panelSize: PanelSize) => {
    if (panelSize.inPixels > 0) {
      setSisteSidebarBredde(panelSize.inPixels)
    }
  }, [])

  return {
    setSidebarPanel,
    handleSidebarResize,
  }
}
