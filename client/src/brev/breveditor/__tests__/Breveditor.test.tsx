import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { usePerson } from '../../../personoversikt/usePerson.ts'
import { BrevContext, type BrevContextType } from '../../BrevContext.ts'
import { type BrevmottakerResponse, Mottakertype } from '../../brevTyper.ts'
import { useBrevmottakere } from '../../useBrev.ts'
import { Breveditor, type BreveditorProps } from '../Breveditor.tsx'
import { type BreveditorState } from '../breveditorTyper.ts'

vi.mock('../../../personoversikt/usePerson.ts')
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

function renderEditor() {
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
            brukersFødselsnummer: '',
            saksnummer: 1,
            brevOpprettet: '24. november 2026',
            saksbehandlerNavn: 'Saksbehandler',
            hjelpemiddelsentral: 'Nav hjelpemiddelsentral',
          }}
          initialState={initialState}
          stilarkVersjon="v1"
          onLagreBrev={lagre}
        />
      </BrevContext>
    )
  }
  const { rerender } = render(element())
  return {
    lagre,
    rerender: () => rerender(element()),
    flush: () => act(async () => context.flushLagringRef?.current?.()),
  }
}

function settMottakere(navn?: string, isLoading = false) {
  const data: BrevmottakerResponse = {
    brevmottakere: navn
      ? [
          {
            id: 'mottaker-1',
            navn,
            mottakertype: Mottakertype.FORMIDLER,
            brevId: 'brev-1',
            opprettet: '2026-11-24T12:00:00Z',
            opprettetAv: 'Z123456',
            kanSlettes: true,
          },
        ]
      : [],
  }
  vi.mocked(useBrevmottakere).mockReturnValue({
    data,
    isLoading,
    isValidating: false,
    error: undefined,
    mutate: vi.fn(),
  })
}

describe('Breveditor lagring av brevhodet', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.mocked(usePerson).mockReturnValue({ isLoading: false, manglerIOebs: false })
    settMottakere()
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
      settMottakere(navn)
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
    settMottakere(undefined, true)
    const { lagre, rerender, flush } = renderEditor()
    await act(() => vi.advanceTimersByTimeAsync(1000))
    expect(lagre).not.toHaveBeenCalled()

    settMottakere('Ola Formidler')
    rerender()
    await flush()
    expect(lagre).toHaveBeenCalledTimes(1)
    expect(lagre.mock.lastCall?.[0].valueAsHtml).toContain('<dd>Ola Formidler</dd>')
  })
})
