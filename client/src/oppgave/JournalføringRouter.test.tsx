import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { HttpError } from '../io/HttpError.ts'
import { lagJournalpost } from '../mocks/data/lagJournalpost.ts'
import { lagJournalføringsoppgave } from '../mocks/data/lagOppgave.ts'
import { useJournalpostSuspense } from '../saksbilde/useJournalpost.ts'
import { JournalføringRouter } from './JournalføringRouter.tsx'
import { type Journalføringsoppgave, Oppgavetype } from './oppgaveTypes.ts'
import { type Journalpost } from '../types/types.internal'

vi.mock('../saksbilde/useJournalpost.ts', () => ({ useJournalpostSuspense: vi.fn() }))
vi.mock('../felleskomponenter/personlinje/Personlinje.tsx', () => ({ LasterPersonlinje: () => null }))
vi.mock('../journalføring/Journalføring.tsx', () => ({ default: () => <div>Journalføring V1</div> }))
vi.mock('../journalføring/JournalføringV2.tsx', () => ({ default: () => <div>Journalføring V2</div> }))

const journalpost = lagJournalpost('9006', 'Søknad om hjelpemidler')
const testOppgave = lagJournalføringsoppgave(journalpost)
const oppgave: Journalføringsoppgave = {
  ...testOppgave,
  kategorisering: { ...testOppgave.kategorisering, oppgavetype: Oppgavetype.JOURNALFØRING },
  journalpostId: journalpost.journalpostId,
}

function medBrevkode(brevkode: string) {
  return { ...journalpost, dokumenter: [{ dokumentId: '1', tittel: 'Søknad', brevkode }] } as unknown as Journalpost
}

function feilerMed(status: number) {
  vi.mocked(useJournalpostSuspense).mockImplementation(() => {
    throw new HttpError('feil', status)
  })
}

describe('JournalføringRouter', () => {
  beforeEach(() => {
    // React logger feil som fanges av error boundary
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('viser loader mens journalposten hentes', () => {
    vi.mocked(useJournalpostSuspense).mockImplementation(() => {
      throw new Promise(() => {})
    })
    render(<JournalføringRouter oppgave={oppgave} />)

    expect(screen.getByRole('status', { name: 'Henter journalpost' })).toBeInTheDocument()
  })

  it.each([
    [403, 'Du har ikke tilgang til å se denne journalposten.'],
    [404, 'Journalposten ble ikke funnet.'],
    [500, 'Teknisk feil. Klarte ikke å hente journalposten.'],
  ])('viser feilmelding og ingen journalføring når henting feiler med %i', async (status, melding) => {
    feilerMed(status)
    render(<JournalføringRouter oppgave={oppgave} />)

    expect(await screen.findByText(melding)).toBeInTheDocument()
    expect(screen.queryByText(/Journalføring V/)).not.toBeInTheDocument()
  })

  it('velger V2 for vanlige søknader', async () => {
    vi.mocked(useJournalpostSuspense).mockReturnValue({ journalpost: medBrevkode('NAV 10-07.03'), mutate: vi.fn() })
    render(<JournalføringRouter oppgave={oppgave} />)

    expect(await screen.findByText('Journalføring V2')).toBeInTheDocument()
  })

  it('velger V1 for briller til barn', async () => {
    vi.mocked(useJournalpostSuspense).mockReturnValue({ journalpost: medBrevkode('NAV 10-07.34'), mutate: vi.fn() })
    render(<JournalføringRouter oppgave={oppgave} />)

    expect(await screen.findByText('Journalføring V1')).toBeInTheDocument()
  })
})
