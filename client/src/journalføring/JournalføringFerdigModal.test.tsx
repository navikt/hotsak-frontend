import '@testing-library/jest-dom/vitest'

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
    vi.clearAllMocks()
    useJournalpostSakFerdigstiltHendelse.mockReturnValue({
      journalpostSakFerdigstilt: { oppgaveId: 'ny-oppgave-1' },
    })
  })

  it('viser «Behandle saken» og koblingsmelding for eksisterende Hotsak-sak', () => {
    render(
      <JournalføringFerdigModal
        open
        resultat={resultatEksisterendeSak}
        sakType="eksisterende"
        onJournalpostSakFerdigstilt={() => {}}
        onClose={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: 'Behandle saken' })).toBeInTheDocument()
  })

  it('skjuler «Til saken» og viser Gosys-tekst for ekstern fagsak', () => {
    render(
      <JournalføringFerdigModal
        open
        resultat={resultatEksisterendeSak}
        sakType="eksisterende"
        skjulTilSaken
        onJournalpostSakFerdigstilt={() => {}}
        onClose={() => {}}
      />
    )

    expect(
      screen.getByText(
        'Dokumentene ble journalført og knyttet til en eksisterende fagsak. Saken kan behandles videre i Gosys.'
      )
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Til saken' })).not.toBeInTheDocument()
  })

  it('skjuler «Til saken» når journalposten kobles til Gosys generell', () => {
    render(
      <JournalføringFerdigModal
        open
        resultat={resultatEksisterendeSak}
        sakType="eksisterende"
        skjulTilSaken
        onJournalpostSakFerdigstilt={() => {}}
        onClose={() => {}}
      />
    )

    expect(
      screen.getByText(
        'Dokumentene ble journalført og knyttet til en eksisterende fagsak. Saken kan behandles videre i Gosys.'
      )
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Til saken' })).not.toBeInTheDocument()
  })

  it('viser «Behandle saken» og opprettelsesmelding for ny sak', () => {
    render(
      <JournalføringFerdigModal
        open
        resultat={resultatEksisterendeSak}
        sakType="ny"
        onJournalpostSakFerdigstilt={() => {}}
        onClose={() => {}}
      />
    )

    expect(
      screen.getByText('Du kan nå gå til til dine oppgaver, enhetens oppgaver eller fortsette behandling av saken.')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Behandle saken' })).toBeInTheDocument()
  })

  it('viser alltid oppgavelistehandlingene uavhengig av variant', () => {
    render(
      <JournalføringFerdigModal
        open
        resultat={resultatEksisterendeSak}
        sakType="eksisterende"
        skjulTilSaken
        onJournalpostSakFerdigstilt={() => {}}
        onClose={() => {}}
      />
    )

    expect(screen.getAllByRole('button', { name: 'Lukk' }).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Til mine oppgaver' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Til enhetens oppgaver' })).toBeInTheDocument()
  })

  it('varsler én gang når journalposten er ferdigstilt', () => {
    const onJournalpostSakFerdigstilt = vi.fn()
    const hendelse = { oppgaveId: 'ny-oppgave-1' }
    useJournalpostSakFerdigstiltHendelse.mockReturnValue({
      journalpostSakFerdigstilt: undefined,
    })

    const { rerender } = render(
      <JournalføringFerdigModal
        open
        resultat={resultatEksisterendeSak}
        sakType="ny"
        onJournalpostSakFerdigstilt={onJournalpostSakFerdigstilt}
        onClose={() => {}}
      />
    )

    expect(onJournalpostSakFerdigstilt).not.toHaveBeenCalled()

    useJournalpostSakFerdigstiltHendelse.mockReturnValue({
      journalpostSakFerdigstilt: hendelse,
    })
    rerender(
      <JournalføringFerdigModal
        open
        resultat={resultatEksisterendeSak}
        sakType="ny"
        onJournalpostSakFerdigstilt={onJournalpostSakFerdigstilt}
        onClose={() => {}}
      />
    )

    expect(onJournalpostSakFerdigstilt).toHaveBeenCalledTimes(1)

    rerender(
      <JournalføringFerdigModal
        open
        resultat={resultatEksisterendeSak}
        sakType="ny"
        onJournalpostSakFerdigstilt={onJournalpostSakFerdigstilt}
        onClose={() => {}}
      />
    )

    expect(onJournalpostSakFerdigstilt).toHaveBeenCalledTimes(1)
  })
})
