import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { usePerson } from '../../../personoversikt/usePerson.ts'
import { useBehovsmelding } from '../../../saksbilde/useBehovsmelding.ts'
import { Kilde } from '../../../types/hotlibs.ts'
import { BehovsmeldingType, Prioritet, Signaturtype, type Behovsmelding } from '../../../types/BehovsmeldingTypes.ts'
import { BrevContext, type BrevContextType } from '../../BrevContext.ts'
import { type Brevmottaker, Mottakertype, Målform } from '../../brevTyper.ts'
import { useBrevmottakere } from '../../useBrev.ts'
import { Breveditor, type BreveditorProps } from '../Breveditor.tsx'
import { type BreveditorState } from '../breveditorTyper.ts'
import { Kjønn, type Person } from '../../../types/types.internal.ts'
import { SpesiellePlaceholdere } from '../plugins/placeholder/parseTekstMedPlaceholders.ts'

vi.mock('../../../personoversikt/usePerson.ts')
vi.mock('../../../saksbilde/useBehovsmelding.ts')
vi.mock('../../useBrev.ts')
vi.mock('../versjonerte-brev-stilark/v1.less?raw', () => ({ default: 'body { color: black; }' }))
vi.mock('../useEditorScale.ts', () => ({
  useEditorScale: () => ({ widthScale: 1, heightScale: 'auto' }),
}))
vi.mock('../verktøylinje/Verktøylinje.tsx', () => ({ Verktøylinje: () => null }))
vi.mock('../plugins/placeholder/PlaceholderErrorSummary/PlaceholderErrorSummary.tsx', () => ({
  PlaceholderErrorSummary: () => null,
}))

const initialState: BreveditorState = {
  value: [{ type: 'p', children: [{ text: 'Teksten i vedtaksbrevet.' }] }],
  valueAsHtml: '',
  history: { undos: [], redos: [] },
}

const personMedVerge: Person = {
  fnr: '01019012345',
  navn: { fornavn: 'Kari', etternavn: 'Nordmann' },
  kjønn: Kjønn.KVINNE,
  isSkjermet: false,
  vergemål: [
    {
      fnr: '02029012345',
      navn: { fornavn: 'Ola', etternavn: 'Verge' },
    },
  ],
}

const digitalBehovsmelding: Behovsmelding = {
  id: 'behovsmelding-1',
  type: BehovsmeldingType.SØKNAD,
  innsendingsdato: '2026-01-15',
  prioritet: Prioritet.NORMAL,
  hjmBrukersFnr: personMedVerge.fnr,
  skjemaversjon: 1,
  kilde: Kilde.DIGITAL_BEHOVSMELDING,
  isDigitalBehovsmelding: true,
  bruker: {
    fnr: personMedVerge.fnr,
    navn: { fornavn: 'Kari', etternavn: 'Nordmann' },
    signaturtype: Signaturtype.BRUKER_BEKREFTER,
    legacyopplysninger: [],
  },
  brukersituasjon: {
    vilkår: [],
    funksjonsnedsettelser: [],
  },
  hjelpemidler: {
    hjelpemidler: [],
    tilbehør: [],
    produktkategorier: [],
    totaltAntall: 0,
  },
  levering: {
    hjelpemiddelformidler: {
      navn: { fornavn: 'Ola', etternavn: 'Formidler' },
      arbeidssted: 'NAV',
      stilling: 'Ergoterapeut',
      telefon: '12345678',
      adresse: {
        adresselinje1: 'Gate 1',
        postnummer: '0123',
        poststed: 'Oslo',
      },
      epost: 'ola@kommune.no',
      treffesEnklest: 'dagtid',
    },
    automatiskUtledetTilleggsinfo: [],
  },
  innsender: {
    kurs: [],
  },
  saksbehandlingvarsel: [],
}

const papirBehovsmelding: Behovsmelding = {
  id: 'behovsmelding-2',
  type: BehovsmeldingType.SØKNAD,
  innsendingsdato: '2026-01-15',
  prioritet: Prioritet.NORMAL,
  hjmBrukersFnr: personMedVerge.fnr,
  skjemaversjon: 1,
  kilde: Kilde.JOURNALPOST,
  isDigitalBehovsmelding: false,
}

function lagMottaker(mottakertype: Mottakertype, navn: string, fnr?: string): Brevmottaker {
  return {
    id: `${mottakertype.toLowerCase()}-mottaker`,
    fnr,
    navn,
    mottakertype,
    brevId: 'brev-1',
    opprettet: '2026-11-24T12:00:00Z',
    opprettetAv: 'Z123456',
    kanSlettes: true,
  }
}

function settPerson(personInfo: Person | undefined = personMedVerge) {
  vi.mocked(usePerson).mockImplementation((fnr) => ({
    personInfo: fnr === personMedVerge.fnr ? personInfo : undefined,
    isLoading: false,
    manglerIOebs: false,
  }))
}

function settBehovsmelding(behovsmelding: Behovsmelding | undefined = papirBehovsmelding) {
  vi.mocked(useBehovsmelding).mockReturnValue({
    behovsmelding,
    harKunTilbehør: false,
    isLoading: false,
    isValidating: false,
    error: undefined,
    mutate: vi.fn(),
  })
}

function renderEditor({
  formidlerErMottaker = false,
  initialState: stateOverride = initialState,
  templateMarkdown,
  målform = Målform.BOKMÅL,
}: {
  formidlerErMottaker?: boolean
  initialState?: BreveditorState | null
  templateMarkdown?: string
  målform?: BreveditorProps['målform']
} = {}) {
  const lagre = vi.fn<NonNullable<BreveditorProps['onLagreBrev']>>().mockResolvedValue(undefined)
  const context: BrevContextType = {
    placeholderFeil: [],
    setPlaceholderFeil: vi.fn(),
    synligKryssKnapp: false,
    setSynligKryssKnapp: vi.fn(),
    datoSoknadMottatt: undefined,
    hjelpemidlerSøktOm: undefined,
    flushLagringRef: { current: undefined },
  }
  function element() {
    return (
      <BrevContext value={context}>
        <Breveditor
          brevId="brev-1"
          metadata={{
            brukersNavn: 'Kari Nordmann',
            brukersFødselsnummer: personMedVerge.fnr,
            saksnummer: 1,
            brevOpprettet: '24. november 2026',
            saksbehandlerNavn: 'Saksbehandler',
            hjelpemiddelsentral: 'Nav hjelpemiddelsentral',
          }}
          initialState={stateOverride ?? undefined}
          templateMarkdown={templateMarkdown}
          målform={målform}
          stilarkVersjon="v1"
          onLagreBrev={lagre}
          formidlerErMottaker={formidlerErMottaker}
        />
      </BrevContext>
    )
  }
  const { rerender, container } = render(element())
  return {
    container,
    lagre,
    rerender: () => rerender(element()),
    flush: () => act(async () => context.flushLagringRef?.current?.()),
  }
}

function settMottakere(brevmottakere: Brevmottaker[] = [], isLoading = false) {
  vi.mocked(useBrevmottakere).mockReturnValue({
    data: { brevmottakere },
    isLoading,
    isValidating: false,
    error: undefined,
    mutate: vi.fn(),
  })
}

describe('Breveditor lagring av brevhodet', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    settPerson()
    settMottakere([])
    settBehovsmelding()
  })
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('lagrer HTML når formidler legges til, endres og fjernes uten tekstredigering', async () => {
    const { lagre, rerender, flush } = renderEditor()
    await flush()
    expect(lagre.mock.lastCall?.[0].valueAsHtml).not.toContain('Kopi til kommunal hjelpemiddelformidler')

    for (const navn of ['Ola Formidler', 'Anne Formidler', undefined]) {
      const antallLagringer = lagre.mock.calls.length
      settMottakere(navn ? [lagMottaker(Mottakertype.FORMIDLER, navn)] : [])
      rerender()
      await flush()
      expect(lagre).toHaveBeenCalledTimes(antallLagringer + 1)
      const lagret = lagre.mock.lastCall![0]
      expect(lagret.value).toEqual(initialState.value)
      if (navn) {
        expect(lagret.valueAsHtml).toContain('Kopi til kommunal hjelpemiddelformidler')
        expect(lagret.valueAsHtml).toContain(`<dd>${navn}</dd>`)
      } else {
        expect(lagret.valueAsHtml).not.toContain('Kopi til kommunal hjelpemiddelformidler')
      }
    }

    rerender()
    await act(() => vi.advanceTimersByTimeAsync(1000))
    expect(lagre).toHaveBeenCalledTimes(4)
  })

  it('venter med å lagre HTML til mottakerne er lastet', async () => {
    settMottakere([], true)
    const { lagre, rerender, flush } = renderEditor()
    await act(() => vi.advanceTimersByTimeAsync(1000))
    expect(lagre).not.toHaveBeenCalled()

    settMottakere([lagMottaker(Mottakertype.FORMIDLER, 'Ola Formidler')])
    rerender()
    await flush()
    expect(lagre).toHaveBeenCalledTimes(1)
    expect(lagre.mock.lastCall?.[0].valueAsHtml).toContain('<dd>Ola Formidler</dd>')
  })

  it('viser og lagrer ikke vergemål som ikke er verge-mottaker på innhente-opplysninger-brev', async () => {
    settMottakere([lagMottaker(Mottakertype.FORMIDLER, 'Ola Formidler')])
    const { lagre, flush } = renderEditor({ formidlerErMottaker: true })

    expect(screen.queryByText('Ola Verge')).toBeNull()
    await flush()
    expect(lagre.mock.lastCall?.[0].valueAsHtml).not.toContain('Ola Verge')
  })

  it('viser kopi til bruker kun når bruker er valgt mottaker på innhente-opplysninger-brev', async () => {
    const formidlerMottaker = lagMottaker(Mottakertype.FORMIDLER, 'Ola Formidler')
    settMottakere([formidlerMottaker])
    const { lagre, rerender, flush } = renderEditor({ formidlerErMottaker: true })

    expect(screen.queryByText('Kopi til:')).toBeNull()
    await flush()
    expect(lagre.mock.lastCall?.[0].valueAsHtml).not.toContain('<dt>Kopi til:</dt>')

    settMottakere([formidlerMottaker, lagMottaker(Mottakertype.BRUKER, 'Kari Nordmann', personMedVerge.fnr)])
    rerender()
    expect(screen.getByText('Kopi til:')).toBeTruthy()
    await flush()
    expect(lagre.mock.lastCall?.[0].valueAsHtml).toContain('<dt>Kopi til:</dt><dd>Kari Nordmann</dd>')

    settMottakere([formidlerMottaker, lagMottaker(Mottakertype.VERGE, 'Ola Verge', '02029012345')])
    rerender()
    expect(screen.queryByText('Kopi til:')).toBeNull()
    await flush()
    expect(lagre.mock.lastCall?.[0].valueAsHtml).not.toContain('<dt>Kopi til:</dt>')
  })

  it('viser og lagrer verge-mottakeren, og oppdaterer brevhodet når vergen fjernes', async () => {
    settMottakere([lagMottaker(Mottakertype.VERGE, 'Ola Verge', '02029012345')])
    const { lagre, rerender, flush } = renderEditor({ formidlerErMottaker: true })

    expect(screen.getByText('Ola Verge')).toBeTruthy()
    await flush()
    expect(lagre.mock.lastCall?.[0].valueAsHtml).toContain('<dd>Ola Verge</dd>')

    settMottakere([])
    rerender()
    expect(screen.queryByText('Ola Verge')).toBeNull()
    await flush()
    expect(lagre.mock.lastCall?.[0].valueAsHtml).not.toContain('Ola Verge')
  })

  it('beholder vergemål i eksisterende brevmaler', async () => {
    settMottakere([])
    const { lagre, flush } = renderEditor({ formidlerErMottaker: false })

    expect(screen.getByText('Ola Verge')).toBeTruthy()
    await flush()
    expect(lagre.mock.lastCall?.[0].valueAsHtml).toContain('<dd>Ola Verge</dd>')
  })

  it('initialiserer auto-placeholdere med navn, dato, formidlernavn og digital stilling', async () => {
    settMottakere([lagMottaker(Mottakertype.FORMIDLER, 'Ola Formidler')])
    settBehovsmelding(digitalBehovsmelding)

    const { lagre, flush } = renderEditor({
      initialState: null,
      templateMarkdown:
        '# Bruker: [auto_bruker_navn]\n\nSøknad gjelder [auto_bruker_navn]. Søknaden ble sendt inn [auto_dato_soknad_innsendt] av [auto_formidler_navn], som er [auto_formidler_stilling].',
    })

    expect(screen.getByRole('heading', { name: 'Bruker: Kari Nordmann' })).toBeTruthy()
    const brevtekst = screen.getByRole('textbox', { name: 'Breveditor' }).textContent
    expect(brevtekst).toContain('Søknad gjelder Kari Nordmann.')
    expect(brevtekst).toContain('Ola Formidler')
    expect(brevtekst).toContain('ergoterapeut')
    expect(brevtekst).toContain('15. januar 2026')

    await flush()
    expect(lagre.mock.lastCall?.[0].valueAsHtml).toContain('Søknad gjelder Kari Nordmann')
  })

  it('viser tom, redigerbar stillings-placeholder for papirbehovsmelding uten auto_* tekst', () => {
    settMottakere([lagMottaker(Mottakertype.FORMIDLER, 'Ola Formidler')])
    settBehovsmelding(papirBehovsmelding)

    const { container } = renderEditor({
      initialState: null,
      templateMarkdown: 'Formidler er [auto_formidler_stilling].',
    })

    expect(container.querySelector('[data-placeholder="Formidlers stilling"]')).toBeTruthy()
    expect(screen.queryByText('auto_formidler_stilling')).toBeNull()
  })

  it('lar manglende stillings-placeholder stå tom når stillingsdata kommer senere', () => {
    settBehovsmelding(papirBehovsmelding)
    const { container, rerender } = renderEditor({
      initialState: null,
      templateMarkdown: 'Formidler er [auto_formidler_stilling].',
    })

    settBehovsmelding(digitalBehovsmelding)
    rerender()

    expect(container.querySelector('[data-placeholder="Formidlers stilling"]')?.textContent).toBe('\uFEFF')
  })

  it('fyller tomt formidlernavn når mottaker kommer senere uten å overskrive manuelt innhold', async () => {
    settBehovsmelding(digitalBehovsmelding)
    const stateMedTomtFormidlernavn: BreveditorState = {
      value: [
        { type: 'p', children: [{ text: 'Manuell tekst som skal beholdes.' }] },
        {
          type: 'p',
          children: [
            {
              type: 'placeholder',
              placeholder: 'Formidlers navn',
              autoVerdi: SpesiellePlaceholdere.FORMIDLER_NAVN,
              deletable: true,
              children: [{ text: '\uFEFF' }],
            },
          ],
        },
      ],
      valueAsHtml: '',
      history: { undos: [], redos: [] },
    }

    const { lagre, rerender, flush } = renderEditor({ initialState: stateMedTomtFormidlernavn })
    await flush()

    settMottakere([lagMottaker(Mottakertype.FORMIDLER, 'Ola Formidler')])
    rerender()
    await flush()

    const lagret = lagre.mock.lastCall?.[0]
    expect(lagret?.valueAsHtml).toContain('Manuell tekst som skal beholdes.')
    expect(lagret?.valueAsHtml).toContain('Ola Formidler')
  })

  it('overskriver ikke lagret manuelt formidlernavn når data kommer senere', async () => {
    settBehovsmelding(digitalBehovsmelding)
    const stateMedManueltFormidlernavn: BreveditorState = {
      value: [
        {
          type: 'p',
          children: [
            {
              type: 'placeholder',
              placeholder: 'Formidlers navn',
              autoVerdi: SpesiellePlaceholdere.FORMIDLER_NAVN,
              deletable: true,
              children: [{ text: 'Manuelt navn' }],
            },
          ],
        },
      ],
      valueAsHtml: '',
      history: { undos: [], redos: [] },
    }

    const { lagre, rerender, flush } = renderEditor({ initialState: stateMedManueltFormidlernavn })
    await flush()

    settMottakere([lagMottaker(Mottakertype.FORMIDLER, 'Ola Formidler')])
    rerender()
    await flush()

    const lagret = lagre.mock.lastCall?.[0]
    expect(lagret?.valueAsHtml).toContain('Manuelt navn')
    expect(lagret?.valueAsHtml).not.toContain('<span>Ola Formidler</span>')
  })
})
