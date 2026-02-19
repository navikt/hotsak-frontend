import { useSakContext } from '../SakProvider'
import { PanelId } from './panelReducer'

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
