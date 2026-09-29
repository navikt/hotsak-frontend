import '@testing-library/jest-dom/vitest'

import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SidebarValg } from '../SakPanelTabTypes'
import { VertikalIkonBar } from './VertikalIkonBar'

const setAktivSidebar = vi.fn()
const useNotater = vi.fn()
let sakId: string | undefined = 'sak-1'

vi.mock('../../../saksbilde/useSak', () => ({
  useSak: () => ({ sak: sakId ? { data: { sakId } } : undefined }),
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
    sakId = 'sak-1'
  })

  it('åpner notatpanelet som standard når saken har notater', () => {
    useNotater.mockReturnValue({ antallNotater: 1, harHentetNotater: true, isLoading: false })

    render(<VertikalIkonBar />)

    expect(setAktivSidebar).toHaveBeenCalledWith(SidebarValg.NOTATER)
  })

  it('beholder utlånsoversikten som standard når saken ikke har notater', () => {
    useNotater.mockReturnValue({ antallNotater: 0, harHentetNotater: true, isLoading: false })

    render(<VertikalIkonBar />)

    expect(setAktivSidebar).not.toHaveBeenCalled()
  })

  it('venter på notatdata selv om isLoading er false før saken er hentet', () => {
    sakId = undefined
    useNotater.mockReturnValue({ antallNotater: 0, harHentetNotater: false, isLoading: false })

    const { rerender } = render(<VertikalIkonBar />)
    expect(setAktivSidebar).not.toHaveBeenCalled()

    sakId = 'sak-1'
    rerender(<VertikalIkonBar />)
    expect(setAktivSidebar).not.toHaveBeenCalled()

    useNotater.mockReturnValue({ antallNotater: 2, harHentetNotater: true, isLoading: false })
    rerender(<VertikalIkonBar />)
    expect(setAktivSidebar).toHaveBeenCalledExactlyOnceWith(SidebarValg.NOTATER)
  })
})
