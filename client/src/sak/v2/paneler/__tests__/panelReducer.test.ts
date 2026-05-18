import { describe, expect, it } from 'vitest'

import {
  getTotalVisibleMinWidth,
  getVisiblePanels,
  hasMultiplePanelsOpen,
  initialPanelState,
  panelReducer,
} from '../panelReducer'
import type { PanelAction } from '../panelReducer'

describe('panelReducer', () => {
  describe('TOGGLE_PANEL', () => {
    it('toggler panelsynlighet', () => {
      const state = initialPanelState
      const panelId = Object.keys(state.panels)[0]
      const wasVisible = state.panels[panelId].visible
      const next = panelReducer(state, { type: 'TOGGLE_PANEL', panelId })
      expect(next.panels[panelId].visible).toBe(!wasVisible)
    })

    it('toggler tilbake', () => {
      const state = initialPanelState
      const panelId = Object.keys(state.panels)[0]
      const original = state.panels[panelId].visible
      const toggled = panelReducer(state, { type: 'TOGGLE_PANEL', panelId })
      const toggledBack = panelReducer(toggled, { type: 'TOGGLE_PANEL', panelId })
      expect(toggledBack.panels[panelId].visible).toBe(original)
    })
  })

  describe('SET_PANEL_VISIBILITY', () => {
    it('setter panel synlig', () => {
      const state = initialPanelState
      const panelId = Object.keys(state.panels)[0]
      const next = panelReducer(state, { type: 'SET_PANEL_VISIBILITY', panelId, visible: true })
      expect(next.panels[panelId].visible).toBe(true)
    })

    it('setter panel skjult', () => {
      const state = initialPanelState
      const panelId = Object.keys(state.panels)[0]
      const next = panelReducer(state, { type: 'SET_PANEL_VISIBILITY', panelId, visible: false })
      expect(next.panels[panelId].visible).toBe(false)
    })
  })

  describe('ukjent action', () => {
    it('returnerer samme tilstand', () => {
      const state = initialPanelState
      const next = panelReducer(state, { type: 'UNKNOWN' } as unknown as PanelAction)
      expect(next).toBe(state)
    })
  })

  describe('hjelpefunksjoner', () => {
    it('getTotalVisibleMinWidth summerer synlige panelets minWidths', () => {
      const result = getTotalVisibleMinWidth(initialPanelState)
      expect(result).toBeGreaterThan(0)
    })

    it('getVisiblePanels returnerer kun synlige paneler', () => {
      const visible = getVisiblePanels(initialPanelState)
      visible.forEach((panel) => {
        expect(panel.visible).toBe(true)
      })
    })

    it('hasMultiplePanelsOpen returnerer true når flere paneler er synlige', () => {
      const visible = getVisiblePanels(initialPanelState)
      expect(visible.length).toBeGreaterThan(1)
      expect(hasMultiplePanelsOpen(initialPanelState)).toBe(true)
    })

    it('hasMultiplePanelsOpen returnerer false når kun ett panel er synlig', () => {
      let state = initialPanelState
      const panelIds = Object.keys(state.panels)
      // Lukk alle paneler unntatt det første
      for (let i = 0; i < panelIds.length; i++) {
        state = panelReducer(state, { type: 'SET_PANEL_VISIBILITY', panelId: panelIds[i], visible: i === 0 })
      }
      expect(hasMultiplePanelsOpen(state)).toBe(false)
    })
  })
})
