import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Oppgavetype, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import type { JournalføringV2Response } from './journalføringTypes.ts'
import { JournalføringFerdigModal } from './JournalføringFerdigModal.tsx'

const navigate = vi.fn()
const useJournalpostSakFerdigstiltHendelse = vi.fn()

vi.mock('react-router', () => ({
  useNavigate: () => navigate,
}))

vi.mock('./useJournalpostSakFerdigstiltHendelse.ts', () => ({
  useJournalpostSakFerdigstiltHendelse: (sakId?: string) => useJournalpostSakFerdigstiltHendelse(sakId),
}))

const resultatEksisterendeSak: JournalføringV2Response = {
  sakId: 'sak-1',
  oppgaver: [
    {
      oppgaveId: 'åpen-behandle-sak',
      oppgavetype: Oppgavetype.BEHANDLE_SAK,
      statuskategori: Statuskategori.ÅPEN,
      isÅpen: true,
      isAvsluttet: false,
    },
  ],
}

describe('JournalføringFerdigModal', () => {
  beforeEach(() => {
    useJournalpostSakFerdigstiltHendelse.mockReturnValue({
      journalpostSakFerdigstilt: { oppgaveId: 'ny-oppgave-1' },
    })
  })

  it('viser «Til saken» og koblingsmelding for eksisterende Hotsak-sak', () => {
    render(
      <JournalføringFerdigModal open resultat={resultatEksisterendeSak} sakType="eksisterende" onClose={() => {}} />
    )

    expect(screen.getByText('Journalposten ble koblet til sak sak-1.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Til saken' })).toBeInTheDocument()
  })

  it('skjuler «Til saken» og viser Gosys-tekst for ekstern fagsak', () => {
    render(
      <JournalføringFerdigModal
        open
        resultat={resultatEksisterendeSak}
        sakType="eksisterende"
        eksternFagsak
        onClose={() => {}}
      />
    )

    expect(screen.getByText('Journalføringen er fullført. Saken kan behandles videre i Gosys.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Til saken' })).not.toBeInTheDocument()
  })

  it('viser «Til saken» og opprettelsesmelding for ny sak', () => {
    render(<JournalføringFerdigModal open resultat={resultatEksisterendeSak} sakType="ny" onClose={() => {}} />)

    expect(screen.getByText('Sak med sakId sak-1 ble opprettet.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Til saken' })).toBeInTheDocument()
  })

  it('viser alltid oppgavelistehandlingene uavhengig av variant', () => {
    render(
      <JournalføringFerdigModal
        open
        resultat={resultatEksisterendeSak}
        sakType="eksisterende"
        eksternFagsak
        onClose={() => {}}
      />
    )

    expect(screen.getAllByRole('button', { name: 'Lukk' }).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Til mine oppgaver' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Til enhetens oppgaver' })).toBeInTheDocument()
  })
})
