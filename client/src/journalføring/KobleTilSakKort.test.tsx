import '@testing-library/jest-dom/vitest'

import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SWRConfig } from 'swr'
import { describe, expect, it, vi } from 'vitest'

import { http } from '../io/HttpClient.ts'
import { HttpError } from '../io/HttpError.ts'
import { lagJournalpost as lagMockJournalpost } from '../mocks/data/lagJournalpost.ts'
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

  it('begrenser listen og lar brukeren vise alle saker', async () => {
    const saker = Array.from({ length: MAKS_SAKER_SYNLIG + 2 }, (_, nr) => lagSak(`sak-${nr}`))
    render(<KobleTilSakKort saker={saker} isLoading={false} valgtSak={null} onChange={() => {}} />)

    expect(screen.getAllByRole('radio')).toHaveLength(MAKS_SAKER_SYNLIG + 1)

    await userEvent.click(screen.getByRole('button', { name: `Vis alle (${saker.length})` }))

    expect(screen.getAllByRole('radio')).toHaveLength(saker.length + 1)
    expect(screen.getByRole('button', { name: 'Vis færre' })).toBeInTheDocument()
  })

  it('henter dokumenter én gang når kortet rendres på nytt', async () => {
    const post = vi.spyOn(http, 'post').mockResolvedValue({ journalposter: [] })
    const saker = Array.from({ length: MAKS_SAKER_SYNLIG + 1 }, (_, nr) => lagSak(`sak-${nr}`))

    try {
      renderMedPerson(<KobleTilSakKort saker={saker} isLoading={false} valgtSak={null} onChange={() => {}} />)

      await waitFor(() => expect(post).toHaveBeenCalledTimes(1))
      await userEvent.click(screen.getByRole('button', { name: `Vis alle (${saker.length})` }))

      expect(screen.getAllByRole('radio')).toHaveLength(saker.length + 1)
      expect(post).toHaveBeenCalledTimes(1)
    } finally {
      post.mockRestore()
    }
  })

  it('grupperer journalposter etter sak og fagsystem, og ignorerer manglende sak eller fagsakId', async () => {
    const post = vi.spyOn(http, 'post').mockResolvedValue({
      journalposter: [
        lagJournalpost('jp-hot', '9901', 'HJELPEMIDLER', ['Hotsak-dokument']),
        lagJournalpost('jp-it', '9901', 'IT01', ['IT01-dokument']),
        lagJournalpost('jp-uten-id', null, 'HJELPEMIDLER', ['Uten id']),
        { ...lagJournalpost('jp-uten-sak', undefined, null), sak: undefined },
        { ...lagJournalpost('jp-null-sak', undefined, null), sak: null },
      ],
    })

    try {
      renderMedPerson(
        <KobleTilSakKort
          saker={[lagSak('9901'), lagSak('9901', 'IT01')]}
          isLoading={false}
          valgtSak={null}
          onChange={() => {}}
        />
      )

      await waitFor(() => expect(post).toHaveBeenCalledTimes(1))
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
    const post = vi.spyOn(http, 'post').mockResolvedValue({
      journalposter: [
        lagJournalpost(
          'jp-1',
          '9901',
          'HJELPEMIDLER',
          ['Første dokument', 'Andre dokument', 'En svært lang dokumenttittel uten mellomrom som skal forbli intakt'],
          'U'
        ),
        lagJournalpost('jp-2', '9901', 'HJELPEMIDLER', ['Mottatt søknad'], 'I'),
        lagJournalpost('jp-3', '9901', 'HJELPEMIDLER', ['Notatdokument'], 'N'),
      ],
    })

    try {
      renderMedPerson(<KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={() => {}} />)
      await åpneSakskort('Hjelpemidler')

      expect(await screen.findByText('Første dokument')).toBeInTheDocument()
      expect(screen.getByText('Andre dokument')).toBeInTheDocument()
      expect(screen.getByText('En svært lang dokumenttittel uten mellomrom som skal forbli intakt')).toBeInTheDocument()
      expect(screen.getAllByText('03.02.2025')).toHaveLength(3)
      expect(screen.getByText('Utgående dokument')).toHaveAttribute('data-color', 'meta-lime')
      expect(screen.getByText('Inngående dokument')).toHaveAttribute('data-color', 'meta-purple')
      expect(screen.getByText('Notat')).toHaveAttribute('data-color', 'neutral')

      const journalpost = screen.getByText('Første dokument').closest('ul')?.parentElement
      expect(journalpost?.children[1]).toHaveClass(classes.dokumentListe)
      const type = within(journalpost as HTMLElement).getByText('Utgående dokument')
      const dokumenter = within(journalpost as HTMLElement).getByRole('link', { name: 'Andre dokument' })
      const dato = within(journalpost as HTMLElement).getByText('03.02.2025')
      expect(type.compareDocumentPosition(dokumenter) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
      expect(dokumenter.compareDocumentPosition(dato) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
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
    const post = vi.spyOn(http, 'post').mockResolvedValue({
      journalposter: [lagJournalpost('jp-1', '9901', 'HJELPEMIDLER', ['Søknad'])],
    })
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
    const post = vi.spyOn(http, 'post').mockResolvedValue({ journalposter: [] })
    const fetcher = vi.fn(async () => ({ isDigitalBehovsmelding: false }))

    try {
      renderMedPerson(<KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={() => {}} />, fetcher)
      expect(fetcher).not.toHaveBeenCalled()

      await åpneSakskort('Hjelpemidler')
      await waitFor(() => expect(fetcher).toHaveBeenCalledExactlyOnceWith('/api/sak/9901/behovsmelding'))
      expect(await screen.findByText('Ingen hjelpemidler registrert for saken.')).toBeInTheDocument()
    } finally {
      post.mockRestore()
    }
  })

  it('henter ikke behovsmelding for en IT01-sak', async () => {
    const post = vi.spyOn(http, 'post').mockResolvedValue({ journalposter: [] })
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
    const post = vi.spyOn(http, 'post').mockResolvedValue({
      journalposter: [lagJournalpost('jp-1', '9901', 'HJELPEMIDLER', ['Søknad'])],
    })
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
    const post = vi.spyOn(http, 'post').mockResolvedValue({ journalposter: [] })

    try {
      renderMedPerson(<KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={() => {}} />)
      await åpneSakskort('Hjelpemidler')

      expect(await screen.findByText('Ingen journalposter funnet for denne saken.')).toBeInTheDocument()
    } finally {
      post.mockRestore()
    }
  })

  it('viser søkefeil i stedet for tomtilstand', async () => {
    const post = vi.spyOn(http, 'post').mockRejectedValue(new Error('søket feilet'))

    try {
      renderMedPerson(<KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={() => {}} />)
      await åpneSakskort('Hjelpemidler')

      expect(await screen.findByText('Kunne ikke hente journalposter for saken.')).toBeInTheDocument()
      expect(screen.queryByText('Ingen journalposter funnet for denne saken.')).not.toBeInTheDocument()
    } finally {
      post.mockRestore()
    }
  })

  it('viser status ved tittelen og Åpne ved sak-ID uten å utvide kortet', async () => {
    const post = vi.spyOn(http, 'post').mockResolvedValue({ journalposter: [] })
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
