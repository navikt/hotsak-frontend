export type PanelId = 'behandlingspanel' | 'brevpanel' | 'behovsmeldingspanel' | 'sidebarpanel'

export interface PanelConfig {
  id: PanelId
  visible: boolean
  minWidth: number
  minWidthUnit: 'px' | '%' | 'rem' | 'em' | 'vw' | 'vh'
  defaultSize: number
}

export interface PanelState {
  panels: Record<PanelId, PanelConfig>
}

export type PanelAction =
  | { type: 'TOGGLE_PANEL'; panelId: PanelId }
  | { type: 'SET_PANEL_VISIBILITY'; panelId: PanelId; visible: boolean }

export const initialPanelState: PanelState = {
  panels: {
    behandlingspanel: {
      id: 'behandlingspanel',
      visible: true,
      minWidth: 240,
      minWidthUnit: 'px',
      defaultSize: 25,
    },
    brevpanel: {
      id: 'brevpanel',
      visible: false,
      minWidth: 320,
      minWidthUnit: 'px',
      defaultSize: 40,
    },
    behovsmeldingspanel: {
      id: 'behovsmeldingspanel',
      visible: true,
      minWidth: 400,
      minWidthUnit: 'px',
      defaultSize: 34,
    },
    sidebarpanel: {
      id: 'sidebarpanel',
      visible: true,
      minWidth: 375,
      minWidthUnit: 'px',
      defaultSize: 20,
    },
  },
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
