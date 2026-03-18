import { PANELS, PanelDefinition } from './panelConfig'

export type { PanelId, WidthUnit } from './panelConfig'
export type { PanelDefinition }

export interface PanelConfig extends Omit<PanelDefinition, 'defaultVisible'> {
  id: string
  visible: boolean
}

export interface PanelState {
  panels: Record<string, PanelConfig>
}

export type PanelAction =
  | { type: 'TOGGLE_PANEL'; panelId: string }
  | { type: 'SET_PANEL_VISIBILITY'; panelId: string; visible: boolean }

export const initialPanelState: PanelState = {
  panels: Object.fromEntries(
    PANELS.map(({ defaultVisible, ...rest }) => [rest.id, { ...rest, visible: defaultVisible }])
  ),
}

export function panelReducer(state: PanelState, action: PanelAction): PanelState {
  switch (action.type) {
    case 'TOGGLE_PANEL':
      return {
        ...state,
        panels: {
          ...state.panels,
          [action.panelId]: {
            ...state.panels[action.panelId],
            visible: !state.panels[action.panelId].visible,
          },
        },
      }
    case 'SET_PANEL_VISIBILITY':
      return {
        ...state,
        panels: {
          ...state.panels,
          [action.panelId]: {
            ...state.panels[action.panelId],
            visible: action.visible,
          },
        },
      }
    default:
      return state
  }
}

export function getTotalVisibleMinWidth(state: PanelState): number {
  return Object.values(state.panels)
    .filter((panel) => panel.visible)
    .reduce((total, panel) => total + panel.minWidth, 0)
}

export function getVisiblePanels(state: PanelState): PanelConfig[] {
  return Object.values(state.panels).filter((panel) => panel.visible)
}

export function hasMultiplePanelsOpen(state: PanelState): boolean {
  return Object.values(state.panels).filter((panel) => panel.visible).length > 1
}
