import '@testing-library/jest-dom'

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
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
  it('viser valgt tittel og sender fritekst og valgte forslag til forelderen', async () => {
    const user = userEvent.setup()
    const onTittelChange = vi.fn()
    function TestRow() {
      const [valgtTittel, setValgtTittel] = useState('Opprinnelig tittel')
      return (
        <DokumentRad
          dokument={dokument}
          index={0}
          total={1}
          valgtTittel={valgtTittel}
          onTittelChange={(tittel) => {
            onTittelChange(tittel)
            setValgtTittel(tittel)
          }}
          valgteChips={[]}
          onChipsChange={vi.fn()}
          visTittelFeil={false}
        />
      )
    }
    render(<TestRow />)
    const input = screen.getByRole('combobox', { name: 'Dokumenttittel (1 av 1)' })
    expect(input).toHaveValue('Opprinnelig tittel')

    await user.clear(input)
    await user.type(input, 'Egen tittel')
    expect(onTittelChange).toHaveBeenLastCalledWith('Egen tittel')
    expect(input).toHaveValue('Egen tittel')

    await user.clear(input)
    await user.click(
      within(screen.getByRole('listbox', { name: 'Liste med tekstforslag' })).getByRole('option', { name: 'Ny tittel' })
    )
    expect(onTittelChange).toHaveBeenLastCalledWith('Ny tittel')
  })

  it('åpner ikke forslag når dokumenttittelen er skrivebeskyttet', async () => {
    const user = userEvent.setup()
    const onTittelChange = vi.fn()
    render(
      <DokumentRad
        dokument={dokument}
        index={0}
        total={1}
        valgtTittel="Opprinnelig tittel"
        onTittelChange={onTittelChange}
        valgteChips={[]}
        onChipsChange={vi.fn()}
        readOnly
        visTittelFeil={false}
      />
    )
    const input = screen.getByRole('combobox', { name: 'Dokumenttittel (1 av 1)' })
    await user.click(input)
    expect(input).toHaveAttribute('readonly')
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(onTittelChange).not.toHaveBeenCalled()
  })

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
