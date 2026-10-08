import '@testing-library/jest-dom'

import { render, screen, waitFor } from '@testing-library/react'
import { Fragment, type ReactNode, StrictMode, useState } from 'react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { HttpError } from '../io/HttpError.ts'
import { lagPerson } from '../mocks/data/PersonStore.ts'
import { lagJournalpost } from '../mocks/data/lagJournalpost.ts'
import { lagJournalføringsoppgave } from '../mocks/data/lagOppgave.ts'
import { type Journalføringsoppgave, Oppgavetype } from '../oppgave/oppgaveTypes.ts'
import { PersonContext, usePersonContext } from '../personoversikt/PersonContext.tsx'
import { usePerson } from '../personoversikt/usePerson.ts'
import { JournalføringV2 } from './JournalføringV2.tsx'

const fnrFraForrigeOppgave = '02020299999'
const journalpostensFnr = '01010199999'

const { skjemaFnr } = vi.hoisted(() => ({ skjemaFnr: [] as string[] }))

// Simulerer SWR: personen er ikke tilgjengelig ved første render, men lastes asynkront.
vi.mock('../personoversikt/usePerson.ts', async () => {
  const { useEffect, useState } = await import('react')
  return {
    usePerson: vi.fn((fnr?: string) => {
      const [lastetFnr, setLastetFnr] = useState<string>()
      useEffect(() => {
        if (fnr) Promise.resolve().then(() => setLastetFnr(fnr))
      }, [fnr])
      const lastet = !!fnr && lastetFnr === fnr
      return { personInfo: lastet ? { ...lagPerson(), fnr } : undefined, isLoading: !!fnr && !lastet }
    }),
  }
})
vi.mock('./JournalføringV2Skjema.tsx', () => ({
  JournalføringV2Skjema: () => {
    const { fodselsnummer } = usePersonContext()
    skjemaFnr.push(fodselsnummer)
    return <div>Skjema for {fodselsnummer}</div>
  },
}))
vi.mock('../dokument/DokumentContext.tsx', () => ({ useDokumentContext: () => ({ setValgtDokument: vi.fn() }) }))
vi.mock('../dokument/DokumentPanel.tsx', () => ({ DokumentPanel: () => null }))
vi.mock('../felleskomponenter/resize/ResizeHandle.tsx', () => ({ ResizeHandle: () => null }))
vi.mock('react-resizable-panels', () => ({
  Group: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Panel: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

const journalpost = {
  ...lagJournalpost('9006', 'Søknad om hjelpemidler', { brukerFnr: journalpostensFnr }),
  dokumenter: [],
}
function lagOppgave(jp: typeof journalpost): Journalføringsoppgave {
  const testOppgave = lagJournalføringsoppgave(jp)
  return {
    ...testOppgave,
    kategorisering: { ...testOppgave.kategorisering, oppgavetype: Oppgavetype.JOURNALFØRING },
    journalpostId: jp.journalpostId,
  }
}
const oppgave = lagOppgave(journalpost)

function MedGammeltFødselsnummerIContext({ children, strict = true }: { children: ReactNode; strict?: boolean }) {
  const [fodselsnummer, setFodselsnummer] = useState(fnrFraForrigeOppgave)
  const Modus = strict ? StrictMode : Fragment
  return (
    <Modus>
      <MemoryRouter>
        <PersonContext value={{ fodselsnummer, setFodselsnummer }}>
          <span data-context-fnr={fodselsnummer} />
          {children}
        </PersonContext>
      </MemoryRouter>
    </Modus>
  )
}

const lastPersonAsynkront = vi.mocked(usePerson).getMockImplementation()!

describe('JournalføringV2', () => {
  afterEach(() => {
    vi.mocked(usePerson).mockImplementation(lastPersonAsynkront)
  })

  it('viser journalpostens bruker og bruker aldri fødselsnummeret fra forrige oppgave', async () => {
    render(
      <MedGammeltFødselsnummerIContext>
        <JournalføringV2 oppgave={oppgave} journalpost={journalpost} mutateJournalpost={vi.fn()} />
      </MedGammeltFødselsnummerIContext>
    )

    expect(await screen.findByText('Fnr: 010101 99999')).toBeInTheDocument()
    expect(screen.getByText(`Skjema for ${journalpostensFnr}`)).toBeInTheDocument()
    expect(usePerson).toHaveBeenCalledWith(journalpostensFnr)
    expect(usePerson).not.toHaveBeenCalledWith(fnrFraForrigeOppgave)
    expect(skjemaFnr).not.toContain(fnrFraForrigeOppgave)
  })

  it('bytter til bruker B når journalposten byttes fra A til B', async () => {
    // Uten StrictMode: StrictMode kjører gatens effect på nytt etter cleanup og skjuler rekkefølgefeil.
    const fnrB = '03030399999'
    const journalpostB = {
      ...lagJournalpost('9007', 'Søknad om hjelpemidler', { brukerFnr: fnrB }),
      dokumenter: [],
    }
    const { container, rerender } = render(
      <MedGammeltFødselsnummerIContext strict={false}>
        <JournalføringV2 oppgave={oppgave} journalpost={journalpost} mutateJournalpost={vi.fn()} />
      </MedGammeltFødselsnummerIContext>
    )
    expect(await screen.findByText('Fnr: 010101 99999')).toBeInTheDocument()

    skjemaFnr.length = 0
    vi.mocked(usePerson).mockClear()
    rerender(
      <MedGammeltFødselsnummerIContext strict={false}>
        <JournalføringV2 oppgave={lagOppgave(journalpostB)} journalpost={journalpostB} mutateJournalpost={vi.fn()} />
      </MedGammeltFødselsnummerIContext>
    )

    expect(await screen.findByText('Fnr: 030303 99999')).toBeInTheDocument()
    expect(screen.getByText(`Skjema for ${fnrB}`)).toBeInTheDocument()
    await waitFor(() => expect(container.querySelector('[data-context-fnr]')).toHaveAttribute('data-context-fnr', fnrB))
    expect(vi.mocked(usePerson).mock.calls.at(-1)).toEqual([fnrB])
    expect(usePerson).not.toHaveBeenCalledWith('')
    expect(skjemaFnr).not.toContain('')
    expect(skjemaFnr).not.toContain(journalpostensFnr)
  })

  it.each([
    [403, 'Du har ikke tilgang til å se informasjon om denne brukeren'],
    [404, 'Person ikke funnet i PDL'],
    [500, 'Teknisk feil. Klarte ikke å hente person fra PDL.'],
  ])('viser feilmelding og skjuler skjemaet når personoppslaget feiler med %i', async (status, melding) => {
    vi.mocked(usePerson).mockReturnValue({ error: new HttpError('feil', status), isLoading: false })
    skjemaFnr.length = 0

    render(
      <MedGammeltFødselsnummerIContext>
        <JournalføringV2 oppgave={oppgave} journalpost={journalpost} mutateJournalpost={vi.fn()} />
      </MedGammeltFødselsnummerIContext>
    )

    expect(await screen.findByText(melding)).toBeInTheDocument()
    expect(screen.queryByText(/Skjema for/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Fnr:/)).not.toBeInTheDocument()
    expect(skjemaFnr).toHaveLength(0)
  })
})
