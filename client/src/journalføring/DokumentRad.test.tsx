import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { type Dokument } from '../types/types.internal.ts'
import { DokumentRad } from './DokumentRad.tsx'

vi.mock('../oppgave/useKodeverkOppgave.ts', () => ({
  useKodeverkDokumenttitler: () => ['Opprinnelig tittel', 'Ny tittel'],
}))

const dokument: Dokument = {
  journalpostId: 'journalpost-1',
  dokumentId: 'dokument-1',
  tittel: 'Opprinnelig tittel',
  logiskeVedlegg: [],
}

describe('DokumentRad', () => {
  it('viser feltfeil for tom dokumenttittel etter forsøk på journalføring', () => {
    render(
      <DokumentRad
        dokument={dokument}
        index={0}
        total={1}
        valgtTittel=""
        onTittelChange={vi.fn()}
        valgteChips={[]}
        onChipsChange={vi.fn()}
        visTittelFeil
      />
    )

    expect(screen.getByText('Du må skrive en dokumenttittel')).toBeVisible()
    expect(screen.getByRole('combobox', { name: 'Dokumenttittel (1 av 1)' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('skjuler feilen når dokumenttittelen er rettet', () => {
    const props = {
      dokument,
      index: 0,
      total: 1,
      onTittelChange: vi.fn(),
      valgteChips: [],
      onChipsChange: vi.fn(),
      visTittelFeil: true,
    }
    const { rerender } = render(<DokumentRad {...props} valgtTittel="ab" />)
    expect(screen.getByText('Dokumenttittelen må ha minst 3 tegn')).toBeVisible()

    rerender(<DokumentRad {...props} valgtTittel="Ny tittel" />)
    expect(screen.queryByText('Dokumenttittelen må ha minst 3 tegn')).not.toBeInTheDocument()
  })
})
