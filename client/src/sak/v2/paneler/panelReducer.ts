import { Sakstype } from '../../../types/types.internal'
import { PANELS, PanelDefinition, type PanelId } from './panelConfig'

export type { PanelId, WidthUnit } from './panelConfig'
export type { PanelDefinition }

export interface PanelConfig extends Omit<PanelDefinition, 'defaultVisible'> {
  id: string
  visible: boolean
}

export interface PanelState {
  sakstype: Sakstype
  panels: Record<string, PanelConfig>
}

export type PanelAction =
  | { type: 'TOGGLE_PANEL'; panelId: string }
  | { type: 'SET_PANEL_VISIBILITY'; panelId: string; visible: boolean }

function isPanelDisabledForSakstype(panelId: string, sakstype: Sakstype): boolean {
  const panelDefinition = PANELS.find((panel) => panel.id === panelId) as PanelDefinition | undefined
  return panelDefinition?.disabledForSakstyper?.includes(sakstype) ?? false
}

export function createInitialPanelState(sakstype: Sakstype): PanelState {
  return {
    sakstype,
    panels: Object.fromEntries(
      PANELS.map(({ defaultVisible, ...rest }) => {
        const visible = isPanelDisabledForSakstype(rest.id, sakstype) ? false : defaultVisible
        return [rest.id, { ...rest, visible }]
      })
    ),
  }
}

export const initialPanelState: PanelState = createInitialPanelState(Sakstype.SØKNAD)

export function panelReducer(state: PanelState, action: PanelAction): PanelState {
  const currentPanel = state.panels[action.panelId]
  if (!currentPanel) {
    return state
  }

  const panelIsDisabled = isPanelDisabledForSakstype(action.panelId, state.sakstype)

  switch (action.type) {
    case 'TOGGLE_PANEL':
      if (panelIsDisabled) {
        return state
      }
      return {
        ...state,
        panels: {
          ...state.panels,
          [action.panelId]: {
            ...currentPanel,
            visible: !currentPanel.visible,
          },
        },
      }
    case 'SET_PANEL_VISIBILITY':
      return {
        ...state,
        panels: {
          ...state.panels,
          [action.panelId]: {
            ...currentPanel,
            visible: panelIsDisabled ? false : action.visible,
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

export function hasVisiblePanelToLeft(state: PanelState, panelId: PanelId): boolean {
  const panelOrder = PANELS.map((panel) => panel.id)
  const panelIndex = panelOrder.indexOf(panelId)

  if (panelIndex <= 0) {
    return false
  }

  return panelOrder.slice(0, panelIndex).some((id) => state.panels[id]?.visible)
}
