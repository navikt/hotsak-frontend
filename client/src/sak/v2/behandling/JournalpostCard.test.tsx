import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Saksdokument, SaksdokumentType } from '../../../types/types.internal.ts'
import { JournalpostCard, skalDokumentkortVæreÅpent } from './JournalpostCard.tsx'

const { setValgtDokument, setDokumentpanelSynlig } = vi.hoisted(() => ({
  setValgtDokument: vi.fn(),
  setDokumentpanelSynlig: vi.fn(),
}))

const dokument: Saksdokument = {
  sakId: 'sak-1',
  journalpostId: 'journalpost-1',
  type: SaksdokumentType.INNGÅENDE,
  opprettet: new Date().toISOString(),
  originalTekst: undefined,
  dokumentId: 'dokument-1',
  saksbehandler: { navn: 'Saksbehandler Navn', id: 'saksbehandler-1', epost: 'saksbehandler@nav.no' },
  tittel: 'Søknad om hjelpemidler',
  brevkode: 'NAV 10-07.03',
  logiskeVedlegg: [],
}

vi.mock('../../../saksbilde/useJournalposter', () => ({
  useJournalposterInngående: () => ({ dokumenter: [dokument] }),
}))

vi.mock('../../../dokument/DokumentContext.tsx', () => ({
  useDokumentContext: () => ({
    valgtDokument: { journalpostId: '', dokumentId: '' },
    setValgtDokument,
  }),
}))

vi.mock('../../../saksregler/useSaksregler.ts', () => ({
  // erPapirsøknad: true holder dokumentkortet åpent som default, se skalDokumentkortVæreÅpent.
  useSaksregler: () => ({ erPapirsøknad: true }),
}))

vi.mock('../paneler/usePanelHooks.ts', () => ({
  useSetPanelVisibility: () => setDokumentpanelSynlig,
}))

describe('skalDokumentkortVæreÅpent', () => {
  it('slår sammen dokumentkortet for digitale søknader med høyst ett dokument', () => {
    expect(skalDokumentkortVæreÅpent(false, 0)).toBe(false)
    expect(skalDokumentkortVæreÅpent(false, 1)).toBe(false)
    expect(skalDokumentkortVæreÅpent(false, 2)).toBe(true)
  })

  it('åpner dokumentkortet for papirsøknader', () => {
    expect(skalDokumentkortVæreÅpent(true, 0)).toBe(true)
  })
})

describe('JournalpostCard', () => {
  it('viser dokumenttittelen som en lenke som åpner dokumentet i ny fane', () => {
    render(<JournalpostCard />)

    const lenke = screen.getByRole('link', { name: dokument.tittel })
    expect(lenke).toHaveAttribute('href', `/api/journalpost/${dokument.journalpostId}/${dokument.dokumentId}`)
    expect(lenke).toHaveAttribute('target', '_blank')
    expect(lenke).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('velger dokumentet og åpner dokumentpanelet når «Vis» klikkes', async () => {
    const user = userEvent.setup()
    render(<JournalpostCard />)

    await user.click(screen.getByRole('button', { name: 'Vis' }))

    expect(setValgtDokument).toHaveBeenCalledWith({
      journalpostId: dokument.journalpostId,
      dokumentId: dokument.dokumentId,
    })
    expect(setDokumentpanelSynlig).toHaveBeenCalledWith(true)
  })

  it('har ikke lenger en egen ikonlenke for å åpne dokumentet i ny fane', () => {
    render(<JournalpostCard />)

    expect(screen.queryByTitle(/åpne .* i ny fane/i)).not.toBeInTheDocument()
  })
})
