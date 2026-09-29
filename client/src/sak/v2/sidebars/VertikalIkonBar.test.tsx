import '@testing-library/jest-dom/vitest'

import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SidebarValg } from '../SakPanelTabTypes'
import { VertikalIkonBar } from './VertikalIkonBar'

const setAktivSidebar = vi.fn()
const useNotater = vi.fn()
const useKommentarer = vi.fn()
let sakId: string | undefined = 'sak-1'

vi.mock('../../../saksbilde/useSak', () => ({
  useSak: () => ({ sak: sakId ? { data: { sakId } } : undefined }),
}))

vi.mock('../../notat/useNotater', () => ({
  useNotater: () => useNotater(),
}))

vi.mock('../../../oppgave/kommentar/useOppgavekommentarer', () => ({
  useOppgavekommentarerForSak: () => useKommentarer(),
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
    useKommentarer.mockReturnValue({ antallKommentarer: 0, harHentetKommentarer: true })
  })

  it('åpner notatpanelet som standard når saken har notater', () => {
    useNotater.mockReturnValue({ antallNotater: 1, harHentetNotater: true })

    render(<VertikalIkonBar />)

    expect(setAktivSidebar).toHaveBeenCalledWith(SidebarValg.NOTATER)
  })

  it('åpner notatpanelet som standard når saken bare har kommentarer', () => {
    useNotater.mockReturnValue({ antallNotater: 0, harHentetNotater: true })
    useKommentarer.mockReturnValue({ antallKommentarer: 1, harHentetKommentarer: true })

    render(<VertikalIkonBar />)

    expect(setAktivSidebar).toHaveBeenCalledWith(SidebarValg.NOTATER)
  })

  it('beholder utlånsoversikten som standard når saken ikke har notater', () => {
    useNotater.mockReturnValue({ antallNotater: 0, harHentetNotater: true })

    render(<VertikalIkonBar />)

    expect(setAktivSidebar).not.toHaveBeenCalled()
  })

  it('venter på begge svarene når saken lastes sent', () => {
    sakId = undefined
    useNotater.mockReturnValue({ antallNotater: 0, harHentetNotater: false })
    useKommentarer.mockReturnValue({ antallKommentarer: 0, harHentetKommentarer: false })

    const { rerender } = render(<VertikalIkonBar />)
    expect(setAktivSidebar).not.toHaveBeenCalled()

    sakId = 'sak-1'
    rerender(<VertikalIkonBar />)
    expect(setAktivSidebar).not.toHaveBeenCalled()

    useNotater.mockReturnValue({ antallNotater: 2, harHentetNotater: true })
    rerender(<VertikalIkonBar />)
    expect(setAktivSidebar).not.toHaveBeenCalled()

    useKommentarer.mockReturnValue({ antallKommentarer: 0, harHentetKommentarer: true })
    rerender(<VertikalIkonBar />)
    expect(setAktivSidebar).toHaveBeenCalledExactlyOnceWith(SidebarValg.NOTATER)
  })

  it('venter på notatene selv om kommentarene kommer først', () => {
    useNotater.mockReturnValue({ antallNotater: 0, harHentetNotater: false })
    useKommentarer.mockReturnValue({ antallKommentarer: 1, harHentetKommentarer: true })

    const { rerender } = render(<VertikalIkonBar />)
    expect(setAktivSidebar).not.toHaveBeenCalled()

    useNotater.mockReturnValue({ antallNotater: 0, harHentetNotater: true })
    rerender(<VertikalIkonBar />)
    expect(setAktivSidebar).toHaveBeenCalledExactlyOnceWith(SidebarValg.NOTATER)
  })
})
