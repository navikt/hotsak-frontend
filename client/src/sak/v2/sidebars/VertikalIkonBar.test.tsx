import '@testing-library/jest-dom/vitest'

import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SidebarValg } from '../SakPanelTabTypes'
import { VertikalIkonBar } from './VertikalIkonBar'

const setAktivSidebar = vi.fn()
const useNotater = vi.fn()

vi.mock('../../../saksbilde/useSak', () => ({
  useSak: () => ({ sak: { data: { sakId: 'sak-1' } } }),
}))

vi.mock('../../notat/useNotater', () => ({
  useNotater: () => useNotater(),
}))

vi.mock('../../notat/NotaterIcon', () => ({
  NotaterIcon: () => null,
}))

vi.mock('../../notat/UtlånsoversiktIcon', () => ({
  UtlånsoversiktIcon: () => null,
}))

vi.mock('../SakV2ContextType', () => ({
  useSakContext: () => ({
    aktivSidebar: SidebarValg.HJELPEMIDDELOVERSIKT,
    setAktivSidebar,
    panelState: {
      panels: {
        sidebarpanel: { visible: true },
      },
    },
  }),
}))

describe('VertikalIkonBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('åpner notatpanelet som standard når saken har notater', async () => {
    useNotater.mockReturnValue({ antallNotater: 1, isLoading: false })

    render(<VertikalIkonBar />)

    await waitFor(() => expect(setAktivSidebar).toHaveBeenCalledWith(SidebarValg.NOTATER))
  })

  it('beholder utlånsoversikten som standard når saken ikke har notater', async () => {
    useNotater.mockReturnValue({ antallNotater: 0, isLoading: false })

    render(<VertikalIkonBar />)

    await waitFor(() => expect(setAktivSidebar).not.toHaveBeenCalled())
  })
})
