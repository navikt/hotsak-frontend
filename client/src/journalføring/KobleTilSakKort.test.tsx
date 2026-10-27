import '@testing-library/jest-dom/vitest'

import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SWRConfig } from 'swr'
import { describe, expect, it, vi } from 'vitest'

import { http } from '../io/HttpClient.ts'
import { HttpError } from '../io/HttpError.ts'
import { lagJournalføringssaker } from '../mocks/data/lagSak.ts'
import { lagJournalpost as lagMockJournalpost } from '../mocks/data/lagJournalpost.ts'
import { lagOppgave } from '../mocks/data/lagOppgave.ts'
import { type Oppgavekommentar } from '../oppgave/kommentar/useOppgavekommentarer.ts'
import {
  type FinnOppgaverRequest,
  type FinnOppgaverResponse,
  type Oppgave,
  Oppgavetype,
  Statuskategori,
} from '../oppgave/oppgaveTypes.ts'
import { PersonContext } from '../personoversikt/PersonContext.tsx'
import { Saksstatus, type Journalpost } from '../types/types.internal.ts'
import { KobleTilSakKort } from './KobleTilSakKort.tsx'
import { Sakstype } from './journalføringTypes.ts'
import { MAKS_SAKER_SYNLIG, type SakvalgVisning } from './useKobleTilSak.ts'
import classes from './KobleTilSakKort.module.css'

function lagSak(sakId: string, fagsaksystem = 'HOTSAK'): SakvalgVisning {
  return {
    valg: { sakstype: Sakstype.FAGSAK, sakId, fagsaksystem },
    sakId,
    gjelder: fagsaksystem === 'HOTSAK' ? 'Hjelpemidler' : 'Infotrygd',
    dato: '2024-08-21T07:54:14Z',
    fagsystemLabel: fagsaksystem === 'HOTSAK' ? 'Hotsak' : fagsaksystem,
  }
}

function lagJournalpost(
  journalpostId: string,
  fagsakId: string | null | undefined,
  fagsaksystem: string | null,
  dokumentTitler = ['Dokumenttittel'],
  journalposttype: 'I' | 'U' | 'N' = 'I'
): Journalpost {
  return {
    ...lagMockJournalpost(journalpostId, `Journalpost ${journalpostId}`),
    journalpostOpprettetTid: '2025-02-03T10:15:00Z',
    journalposttype,
    dokumenter: dokumentTitler.map((tittel, index) => ({
      journalpostId,
      dokumentId: `${journalpostId}-${index}`,
      tittel,
      logiskeVedlegg: [],
    })),
    sak: fagsakId === undefined ? null : { fagsakId, fagsaksystem, datoOpprettet: null },
  }
}

function renderMedPerson(
  ui: React.ReactNode,
  fetcher: (url: string) => Promise<unknown> = async () => undefined,
  fallback?: Record<string, unknown>
) {
  return render(
    <SWRConfig value={{ provider: () => new Map(), fetcher, fallback }}>
      <PersonContext value={{ fodselsnummer: '01010199999', setFodselsnummer: vi.fn() }}>{ui}</PersonContext>
    </SWRConfig>
  )
}

function mockHttpPost(
  journalposter: Journalpost[] = [],
  taskResponse: (request: FinnOppgaverRequest) => FinnOppgaverResponse | Promise<FinnOppgaverResponse> = (request) => ({
    oppgaver: [],
    pageNumber: request.pageNumber ?? 1,
    pageSize: request.pageSize ?? 1000,
    totalElements: 0,
    totalPages: 1,
  })
) {
  return vi.spyOn(http, 'post').mockImplementation(async (url, body) => {
    if (url === '/api/oppgaver/sok') {
      return (await taskResponse(body as FinnOppgaverRequest)) as never
    }
    return { journalposter } as never
  })
}

function lagBehandleSakOppgave(oppgaveId: string, sakId: string, beskrivelse = 'Beskrivelse fra oppgaven'): Oppgave {
  const sak = lagJournalføringssaker('01010199999')[0]
  const oppgave = lagOppgave(sak, {
    oppgavetype: Oppgavetype.BEHANDLE_SAK,
    behandlingstema: { kode: 'HJE', term: 'Hjelpemidler' },
    behandlingstype: { kode: 'SØKNAD', term: 'Søknad' },
    tema: 'HJE',
  })
  return { ...oppgave, oppgaveId, sakId, beskrivelse }
}

function lagOppgaveRespons(oppgaver: Oppgave[]): FinnOppgaverResponse {
  return { oppgaver, pageNumber: 1, pageSize: 1000, totalPages: 1, totalElements: oppgaver.length }
}

function forventOppgavefelt(kort: HTMLElement, etikett: string, verdi: string) {
  const etikettelement = within(kort).getByText(etikett)
  expect(etikettelement.closest('p')).toHaveTextContent(verdi)
}

const énSak = [lagSak('9901')]

async function åpneSakskort(tittel: string) {
  const kort = screen.getByText(tittel, { exact: true }).closest('section')
  if (!kort) throw new Error(`Fant ikke sakskortet ${tittel}`)
  await userEvent.click(within(kort).getByRole('button', { expanded: false }))
  expect(within(kort).getByRole('button', { expanded: true })).toBeInTheDocument()
}

describe('KobleTilSakKort', () => {
  it('viser lasteindikator mens sakene hentes', () => {
    render(<KobleTilSakKort saker={[]} isLoading valgtSak={null} onChange={() => {}} />)

    expect(screen.getByText('Henter saker...', { selector: 'p' })).toBeInTheDocument()
  })

  it('viser feilmelding når hentingen feiler', () => {
    render(
      <KobleTilSakKort
        saker={[]}
        isLoading={false}
        error={HttpError.INTERNAL_SERVER_ERROR}
        valgtSak={null}
        onChange={() => {}}
      />
    )

    expect(screen.getByText('Feil med hending av saker')).toBeInTheDocument()
  })

  it('viser tom-melding når brukeren ikke har valgbare saker', () => {
    render(<KobleTilSakKort saker={[]} isLoading={false} valgtSak={null} onChange={() => {}} />)

    expect(screen.getByText('Ingen saker funnet for denne brukeren.')).toBeInTheDocument()
  })

  it('melder fra om valgt sak', async () => {
    const onChange = vi.fn()
    render(<KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={onChange} />)

    await userEvent.click(screen.getByRole('radio', { name: /Velg sak 9901/ }))

    expect(onChange).toHaveBeenCalledWith({ sakstype: Sakstype.FAGSAK, sakId: '9901', fagsaksystem: 'HOTSAK' })
  })

  it('melder fra om Generell sak som valgt sak', async () => {
    const onChange = vi.fn()
    render(<KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={onChange} />)

    await userEvent.click(screen.getByRole('radio', { name: 'Velg Generell sak' }))

    expect(onChange).toHaveBeenCalledWith({ sakstype: Sakstype.GENERELL_SAK })
  })

  it('søker alle åpne behandle-sak-oppgaver for fødselsnummeret uten sak-ID-filter', async () => {
    const requests: FinnOppgaverRequest[] = []
    const oppgaver = [
      lagBehandleSakOppgave('oppgave-9901', '9901', 'Oppgave for sak 9901'),
      lagBehandleSakOppgave('oppgave-9902', '9902', 'Oppgave for sak 9902'),
    ]
    const post = mockHttpPost([], (request) => {
      requests.push(request)
      return lagOppgaveRespons(oppgaver)
    })

    try {
      renderMedPerson(
        <KobleTilSakKort
          saker={[lagSak('9901'), lagSak('9902', 'IT01')]}
          isLoading={false}
          valgtSak={null}
          onChange={() => {}}
        />
      )

      await waitFor(() => expect(requests).toHaveLength(1))
      expect(requests).toEqual([
        {
          brukerId: '01010199999',
          statuskategori: Statuskategori.ÅPEN,
          oppgavetype: [Oppgavetype.BEHANDLE_SAK],
          pageSize: 1000,
        },
      ])
      expect(requests.every((request) => !('sakId' in request))).toBe(true)
      expect(post.mock.calls.filter(([url]) => url === '/api/oppgaver/sok')).toHaveLength(1)

      await åpneSakskort('Hjelpemidler')
      const kort9901 = screen.getByRole('radio', { name: /Velg sak 9901/ }).closest('section') as HTMLElement
      forventOppgavefelt(kort9901, 'Gjelder:', 'Hjelpemidler | Søknad')
      expect(within(kort9901).queryByText('Oppgave for sak 9901')).not.toBeInTheDocument()
      expect(within(kort9901).queryByRole('heading', { name: 'Oppgave' })).not.toBeInTheDocument()

      await åpneSakskort('Infotrygd')
      const kort9902 = screen.getByRole('radio', { name: /Velg sak 9902/ }).closest('section') as HTMLElement
      forventOppgavefelt(kort9902, 'Gjelder:', 'Hjelpemidler | Søknad')
      expect(within(kort9902).queryByText('Oppgave for sak 9902')).not.toBeInTheDocument()
    } finally {
      post.mockRestore()
    }
  })

  it('viser oppgaveinformasjon mellom journalposter og hjelpemidler og laster kommentarer først ved åpning', async () => {
    const oppgave = lagBehandleSakOppgave('oppgave-9901', '9901', 'Beskrivelse i kortet')
    const post = mockHttpPost([lagJournalpost('jp-1', '9901', 'HJELPEMIDLER', ['Journalpost før oppgave'])], () =>
      lagOppgaveRespons([oppgave])
    )
    const kommentarer: Oppgavekommentar[] = [
      {
        tekst: 'Eldre kommentar',
        registrertAvSystem: 'TEST',
        registrertTidspunkt: '2024-01-01T12:00:00Z',
        oppgaveId: oppgave.oppgaveId,
      },
      {
        tekst: 'Nyeste kommentar',
        registrertAv: 'TESTSYSTEM',
        registrertAvSystem: 'TEST',
        registrertTidspunkt: '2025-01-01T12:00:00Z',
        oppgaveId: oppgave.oppgaveId,
      },
    ]
    const fetcher = vi.fn(async (url: string) => (url.endsWith('/kommentarer') ? kommentarer : undefined))

    try {
      renderMedPerson(<KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={() => {}} />, fetcher)
      await waitFor(() => expect(post.mock.calls.some(([url]) => url === '/api/oppgaver/sok')).toBe(true))
      expect(fetcher).not.toHaveBeenCalledWith('/api/oppgaver/oppgave-9901/kommentarer')

      await åpneSakskort('Hjelpemidler')
      const gjelder = await screen.findByText('Gjelder:')
      await screen.findByText('Nyeste kommentar')
      const commentsList = document.querySelector(`ul.${classes.kommentarListe}`)
      expect(commentsList).toBeInTheDocument()
      const commentItems = within(commentsList as HTMLElement).getAllByRole('listitem')
      expect(commentItems[0]).toHaveTextContent('Nyeste kommentar')
      expect(commentItems[0]).toHaveTextContent('Automatisk prosess')
      expect(commentItems[1]).toHaveTextContent('Eldre kommentar')
      expect(kommentarer.map((kommentar) => kommentar.tekst)).toEqual(['Eldre kommentar', 'Nyeste kommentar'])
      expect(screen.queryByText('Beskrivelse i kortet')).not.toBeInTheDocument()

      const hjelpemidler = await screen.findByRole('region', { name: 'Hjelpemidler i saken' })
      const journalpost = screen.getByText('Journalpost før oppgave')
      expect(journalpost.compareDocumentPosition(gjelder) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
      expect(gjelder.compareDocumentPosition(hjelpemidler) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    } finally {
      post.mockRestore()
    }
  })

  it('viser tilgjengelig kategorisering uten skilletegn når behandlingstype mangler', async () => {
    const oppgave = lagBehandleSakOppgave('oppgave-9901', '9901')
    const utenBehandlingstype = {
      ...oppgave,
      kategorisering: { ...oppgave.kategorisering, behandlingstype: undefined },
    }
    const post = mockHttpPost([], () => lagOppgaveRespons([utenBehandlingstype]))

    try {
      renderMedPerson(<KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={() => {}} />)
      await åpneSakskort('Hjelpemidler')

      const kort = screen.getByRole('radio', { name: /Velg sak 9901/ }).closest('section') as HTMLElement
      await waitFor(() => forventOppgavefelt(kort, 'Gjelder:', 'Hjelpemidler'))
      expect(within(kort).getByText('Gjelder:').closest('p')).not.toHaveTextContent('|')
    } finally {
      post.mockRestore()
    }
  })

  it('skjuler oppgaveseksjonen ved søkefeil og viser fortsatt journalposter', async () => {
    const post = mockHttpPost([lagJournalpost('jp-1', '9901', 'HJELPEMIDLER', ['Journalpost beholdes'])], () => {
      throw new Error('oppgavesøket feilet')
    })

    try {
      renderMedPerson(<KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={() => {}} />)
      await åpneSakskort('Hjelpemidler')

      expect(await screen.findByText('Journalpost beholdes')).toBeInTheDocument()
      expect(screen.queryByText('Gjelder:')).not.toBeInTheDocument()
    } finally {
      post.mockRestore()
    }
  })

  it('skjuler kommentarer ved feil, men beholder oppgaveinformasjonen', async () => {
    const oppgave = lagBehandleSakOppgave('oppgave-9901', '9901')
    const post = mockHttpPost([], () => lagOppgaveRespons([oppgave]))
    const fetcher = vi.fn(async (url: string) => {
      if (url.endsWith('/kommentarer')) throw new Error('kommentarene feilet')
      return undefined
    })

    try {
      renderMedPerson(<KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={() => {}} />, fetcher)
      await åpneSakskort('Hjelpemidler')

      const kort = screen.getByRole('radio', { name: /Velg sak 9901/ }).closest('section') as HTMLElement
      await waitFor(() => forventOppgavefelt(kort, 'Gjelder:', 'Hjelpemidler | Søknad'))
      expect(within(kort).queryByText('Beskrivelse fra oppgaven')).not.toBeInTheDocument()
      await waitFor(() => expect(fetcher).toHaveBeenCalledWith('/api/oppgaver/oppgave-9901/kommentarer'))
      expect(document.querySelector(`ul.${classes.kommentarListe}`)).not.toBeInTheDocument()
    } finally {
      post.mockRestore()
    }
  })

  it('skjuler oppgaveseksjonen når saken ikke har en relevant oppgave', async () => {
    const post = mockHttpPost()

    try {
      renderMedPerson(<KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={() => {}} />)
      await åpneSakskort('Hjelpemidler')

      expect(screen.queryByText('Gjelder:')).not.toBeInTheDocument()
    } finally {
      post.mockRestore()
    }
  })

  it('begrenser listen og lar brukeren vise alle saker', async () => {
    const saker = Array.from({ length: MAKS_SAKER_SYNLIG + 2 }, (_, nr) => lagSak(`sak-${nr}`))
    render(<KobleTilSakKort saker={saker} isLoading={false} valgtSak={null} onChange={() => {}} />)

    expect(screen.getAllByRole('radio')).toHaveLength(MAKS_SAKER_SYNLIG + 1)

    await userEvent.click(screen.getByRole('button', { name: `Vis alle (${saker.length})` }))

    expect(screen.getAllByRole('radio')).toHaveLength(saker.length + 1)
    expect(screen.getByRole('button', { name: 'Vis færre' })).toBeInTheDocument()
  })

  it('henter dokumenter én gang når kortet rendres på nytt', async () => {
    const post = mockHttpPost()
    const saker = Array.from({ length: MAKS_SAKER_SYNLIG + 1 }, (_, nr) => lagSak(`sak-${nr}`))

    try {
      renderMedPerson(<KobleTilSakKort saker={saker} isLoading={false} valgtSak={null} onChange={() => {}} />)

      await waitFor(() => expect(post.mock.calls.filter(([url]) => url === '/api/dokumenter/sok')).toHaveLength(1))
      await userEvent.click(screen.getByRole('button', { name: `Vis alle (${saker.length})` }))

      expect(screen.getAllByRole('radio')).toHaveLength(saker.length + 1)
      expect(post.mock.calls.filter(([url]) => url === '/api/dokumenter/sok')).toHaveLength(1)
    } finally {
      post.mockRestore()
    }
  })

  it('grupperer journalposter etter sak og fagsystem, og ignorerer manglende sak eller fagsakId', async () => {
    const post = mockHttpPost([
      lagJournalpost('jp-hot', '9901', 'HJELPEMIDLER', ['Hotsak-dokument']),
      lagJournalpost('jp-it', '9901', 'IT01', ['IT01-dokument']),
      lagJournalpost('jp-uten-id', null, 'HJELPEMIDLER', ['Uten id']),
      { ...lagJournalpost('jp-uten-sak', undefined, null), sak: undefined },
      { ...lagJournalpost('jp-null-sak', undefined, null), sak: null },
    ])

    try {
      renderMedPerson(
        <KobleTilSakKort
          saker={[lagSak('9901'), lagSak('9901', 'IT01')]}
          isLoading={false}
          valgtSak={null}
          onChange={() => {}}
        />
      )

      await waitFor(() => expect(post.mock.calls.filter(([url]) => url === '/api/dokumenter/sok')).toHaveLength(1))
      await åpneSakskort('Hjelpemidler')
      expect(await screen.findByText('Hotsak-dokument')).toBeInTheDocument()
      expect(
        screen.getByRole('radio', { name: /Velg sak 9901: Hjelpemidler/ }).closest('section')
      ).not.toHaveTextContent('IT01-dokument')

      await åpneSakskort('Infotrygd')
      expect(await screen.findByText('IT01-dokument')).toBeInTheDocument()
      expect(screen.getByText('Infotrygd', { exact: true }).closest('section')).not.toHaveTextContent('Uten id')
    } finally {
      post.mockRestore()
    }
  })

  it('viser alle dokumenttitler, dato og tilgjengelig journalposttype i utvidet visning', async () => {
    const post = mockHttpPost([
      lagJournalpost(
        'jp-1',
        '9901',
        'HJELPEMIDLER',
        ['Første dokument', 'Andre dokument', 'En svært lang dokumenttittel uten mellomrom som skal forbli intakt'],
        'U'
      ),
      lagJournalpost('jp-2', '9901', 'HJELPEMIDLER', ['Mottatt søknad'], 'I'),
      lagJournalpost('jp-3', '9901', 'HJELPEMIDLER', ['Notatdokument'], 'N'),
    ])

    try {
      renderMedPerson(<KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={() => {}} />)
      await åpneSakskort('Hjelpemidler')

      expect(await screen.findByText('Første dokument')).toBeInTheDocument()
      expect(screen.getByText('Andre dokument')).toBeInTheDocument()
      expect(screen.getByText('En svært lang dokumenttittel uten mellomrom som skal forbli intakt')).toBeInTheDocument()
      expect(screen.getAllByText('03.02.2025')).toHaveLength(3)
      expect(screen.getByText('Utgående')).toHaveAttribute('data-color', 'meta-lime')
      expect(screen.getByText('Inngående')).toHaveAttribute('data-color', 'meta-purple')
      expect(screen.getByText('Notat')).toHaveAttribute('data-color', 'neutral')

      const journalpost = screen.getByText('Første dokument').closest('ul')?.parentElement
      expect(journalpost?.children[1]).toHaveClass(classes.dokumentListe)
      const type = within(journalpost as HTMLElement).getByText('Utgående')
      const dokumenter = within(journalpost as HTMLElement).getByRole('link', { name: 'Andre dokument' })
      const dato = within(journalpost as HTMLElement).getByText('03.02.2025')
      expect(dato.compareDocumentPosition(dokumenter) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
      expect(dokumenter.compareDocumentPosition(type) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
      expect(screen.getByRole('link', { name: 'Første dokument' })).toHaveAttribute(
        'href',
        '/api/journalpost/jp-1/jp-1-0'
      )
      expect(dokumenter).toHaveAttribute('href', '/api/journalpost/jp-1/jp-1-1')
      expect(dokumenter).toHaveAttribute('target', '_blank')
      expect(dokumenter).toHaveAttribute('rel', 'noopener noreferrer')
    } finally {
      post.mockRestore()
    }
  })

  it('viser hjelpemidler fra behovsmeldingen etter dokumentene', async () => {
    const post = mockHttpPost([lagJournalpost('jp-1', '9901', 'HJELPEMIDLER', ['Søknad'])])
    const behovsmelding = {
      isDigitalBehovsmelding: true,
      hjelpemidler: {
        hjelpemidler: [
          { hjelpemiddelId: '1', antall: 2, produkt: { hmsArtNr: '123456', artikkelnavn: 'Rullestol' } },
          { hjelpemiddelId: '2', antall: 1, produkt: { hmsArtNr: '654321', artikkelnavn: 'Rampe' } },
        ],
        tilbehør: [],
      },
    }

    try {
      renderMedPerson(
        <KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={() => {}} />,
        async () => undefined,
        { '/api/sak/9901/behovsmelding': behovsmelding }
      )

      await åpneSakskort('Hjelpemidler')

      const hjelpemidler = await screen.findByRole('region', { name: 'Hjelpemidler i saken' })
      expect(await within(hjelpemidler).findByRole('link', { name: '123456' })).toHaveAttribute(
        'href',
        'https://finnhjelpemiddel.nav.no/123456'
      )
      expect(within(hjelpemidler).getByRole('link', { name: '654321' })).toHaveAttribute('target', '_blank')
      const rader = within(hjelpemidler).getAllByRole('listitem')
      expect(rader).toHaveLength(2)
      expect(rader[0]).toHaveTextContent('123456')
      expect(rader[0]).toHaveTextContent('Rullestol')
      expect(rader[0]).toHaveTextContent('Antall: 2')
      expect(rader[1]).toHaveTextContent('654321')
      expect(rader[1]).toHaveTextContent('Rampe')
      expect(rader[1]).toHaveTextContent('Antall: 1')
      expect(
        screen.getByText('Søknad').compareDocumentPosition(hjelpemidler) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy()
    } finally {
      post.mockRestore()
    }
  })

  it('henter behovsmeldingen først når Hotsak-saken åpnes', async () => {
    const post = mockHttpPost()
    const fetcher = vi.fn(async () => ({ isDigitalBehovsmelding: false }))

    try {
      renderMedPerson(<KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={() => {}} />, fetcher)
      expect(fetcher).not.toHaveBeenCalled()

      await åpneSakskort('Hjelpemidler')
      await waitFor(() => expect(fetcher).toHaveBeenCalledExactlyOnceWith('/api/sak/9901/behovsmelding'))
    } finally {
      post.mockRestore()
    }
  })

  it('henter ikke behovsmelding for en IT01-sak', async () => {
    const post = mockHttpPost()
    const fetcher = vi.fn(async () => ({}))

    try {
      renderMedPerson(
        <KobleTilSakKort saker={[lagSak('12', 'IT01')]} isLoading={false} valgtSak={null} onChange={() => {}} />,
        fetcher
      )
      await åpneSakskort('Infotrygd')
      expect(screen.queryByRole('region', { name: 'Hjelpemidler i saken' })).not.toBeInTheDocument()
      expect(fetcher).not.toHaveBeenCalled()
    } finally {
      post.mockRestore()
    }
  })

  it('viser hentefeil for hjelpemidler uten å skjule dokumentene', async () => {
    const post = mockHttpPost([lagJournalpost('jp-1', '9901', 'HJELPEMIDLER', ['Søknad'])])
    const fetcher = vi.fn(async () => {
      throw new Error('behovsmeldingen feilet')
    })

    try {
      renderMedPerson(<KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={() => {}} />, fetcher)
      await åpneSakskort('Hjelpemidler')
      expect(await screen.findByText('Kunne ikke hente hjelpemidler for saken.')).toBeInTheDocument()
      expect(await screen.findByText('Søknad')).toBeInTheDocument()
    } finally {
      post.mockRestore()
    }
  })

  it('viser tydelig tomtilstand når saken ikke har journalposter', async () => {
    const post = mockHttpPost()

    try {
      renderMedPerson(<KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={() => {}} />)
      await åpneSakskort('Hjelpemidler')

      expect(await screen.findByText('Ingen dokumenter funnet for denne saken.')).toBeInTheDocument()
    } finally {
      post.mockRestore()
    }
  })

  it('viser søkefeil i stedet for tomtilstand', async () => {
    const post = vi.spyOn(http, 'post').mockImplementation(async (url) => {
      if (url === '/api/oppgaver/sok') {
        return lagOppgaveRespons([]) as never
      }
      throw new Error('søket feilet')
    })

    try {
      renderMedPerson(<KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={() => {}} />)
      await åpneSakskort('Hjelpemidler')

      expect(await screen.findByText('Kunne ikke hente journalposter for saken.')).toBeInTheDocument()
      expect(screen.queryByText('Ingen dokumenter funnet for denne saken.')).not.toBeInTheDocument()
    } finally {
      post.mockRestore()
    }
  })

  it('viser status ved tittelen og Åpne ved sak-ID uten å utvide kortet', async () => {
    const post = mockHttpPost()
    const onChange = vi.fn()
    const sakMedStatus = { ...énSak[0], saksstatus: Saksstatus.MOTTATT }

    try {
      renderMedPerson(<KobleTilSakKort saker={[sakMedStatus]} isLoading={false} valgtSak={null} onChange={onChange} />)
      const åpneSak = screen.getByRole('link', { name: 'Åpne sak 9901 i ny fane' })
      expect(åpneSak).toBeVisible()
      expect(åpneSak).toHaveTextContent('Åpne')
      expect(åpneSak.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
      expect(åpneSak).toHaveAttribute('href', '/sak/9901')
      expect(åpneSak).toHaveAttribute('target', '_blank')
      expect(åpneSak).toHaveAttribute('rel', 'noopener noreferrer')
      const kortHeader = screen.getByText('Hjelpemidler', { exact: true }).closest('.aksel-expansioncard__header')
      expect(kortHeader?.firstElementChild?.firstElementChild).toBe(
        screen.getByRole('radio', { name: /Velg sak 9901/ })
      )
      expect(kortHeader?.firstElementChild?.children[1]).toHaveClass(classes.sakTittel)
      expect(kortHeader?.firstElementChild?.children[2]).toHaveClass(classes.sideDetaljer)
      expect(kortHeader?.firstElementChild?.children[2]).toHaveTextContent('Mottatt')
      expect(kortHeader?.querySelector(`.${classes.sideDetaljer}`)).toHaveTextContent('Dato:')
      expect(kortHeader?.querySelector(`.${classes.hovedDetaljer}`)).toContainElement(åpneSak)
      const utvidKnapp = kortHeader?.querySelector('[aria-expanded]')
      expect(utvidKnapp).toHaveAttribute('aria-expanded', 'false')

      await userEvent.click(screen.getByRole('radio', { name: /Velg sak 9901/ }))
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(utvidKnapp).toHaveAttribute('aria-expanded', 'false')

      await userEvent.click(åpneSak)
      expect(utvidKnapp).toHaveAttribute('aria-expanded', 'false')
    } finally {
      post.mockRestore()
    }
  })

  it('viser Generell sak øverst uten metadata', () => {
    render(<KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={() => {}} />)

    const radioer = screen.getAllByRole('radio')
    expect(radioer[0]).toHaveAccessibleName('Velg Generell sak')
    const generellSakKort = radioer[0].closest('label')
    expect(generellSakKort).toHaveTextContent('Generell sak')
    expect(generellSakKort?.querySelector('[aria-expanded]')).not.toBeInTheDocument()
    expect(generellSakKort).not.toHaveTextContent('Sak:')
    expect(generellSakKort).not.toHaveTextContent('Dato:')
  })

  it('plasserer tittel, radio og høyre metadata i samme indre fagsak-header', () => {
    render(<KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={() => {}} />)

    const radio = screen.getByRole('radio', { name: /Velg sak 9901/ })
    const heading = screen.getByText('Hjelpemidler', { exact: true })
    const innerHeaderGrid = radio.closest(`.${classes.sakHeader}`)?.querySelector(':scope > div:first-child')
    const dato = innerHeaderGrid?.querySelector(`.${classes.sideDetaljer}`)

    expect(innerHeaderGrid).toContainElement(radio)
    expect(innerHeaderGrid).toContainElement(heading)
    expect(dato).toHaveTextContent('Dato: 21.08.2024')
    expect(innerHeaderGrid).toContainElement(screen.getByRole('link', { name: 'Åpne sak 9901 i ny fane' }))
  })
})
