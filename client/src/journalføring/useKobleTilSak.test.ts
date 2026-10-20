import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { type Fagsak, type SaksoversiktSak } from '../personoversikt/saksoversiktTypes.ts'
import { useSaksoversikt } from '../personoversikt/useSaksoversikt.ts'
import { Saksstatus, SaksstatusKategori, Sakstype } from '../types/types.internal.ts'
import { BREVKODE_BRILLER_TIL_BARN } from './journalføringStandardverdier.ts'
import { Sakstype as JournalføringSakstype } from './journalføringTypes.ts'
import { erFagsak, lagSakvalg, useKobleTilSak } from './useKobleTilSak.ts'

vi.mock('../personoversikt/useSaksoversikt.ts', () => ({ useSaksoversikt: vi.fn() }))

const sak = (sakId: string, dato: string, saksstatus: Saksstatus, sakstype = Sakstype.SØKNAD): SaksoversiktSak => ({
  sakId,
  sakstype,
  saksstatus,
  saksstatusGyldigFra: dato,
  område: [],
  mottattTidspunkt: dato,
  gjelder: 'Hjelpemidler',
  fagsaksystem: 'HOTSAK',
})

const fagsak = (fagsakId: string, fagsaksystem: Fagsak['fagsaksystem'] = 'IT01'): Fagsak => ({
  fagsakId,
  fagsaksystem,
  tema: 'HJE',
  sakstype: 'FAGSAK',
  datoOpprettet: '2024-08-20T07:54:14Z',
})

describe('lagSakvalg', () => {
  it('kombinerer saker og HJE-fagsaker i datorekkefølge', () => {
    const resultat = lagSakvalg(
      [sak('hotsak-1', '2024-08-21T07:54:14Z', Saksstatus.AVVENTER_SAKSBEHANDLER)],
      [fagsak('1234A01'), { ...fagsak('1234B01', 'OEBS'), datoOpprettet: '2024-08-22T07:54:14Z' }]
    )

    expect(resultat.map(({ sakId }) => sakId)).toEqual(['1234B01', 'hotsak-1', '1234A01'])
    expect(resultat[0].fagsystemLabel).toBe('OEBS')
    expect(resultat[0].valg).toEqual({
      sakstype: JournalføringSakstype.FAGSAK,
      sakId: '1234B01',
      fagsaksystem: 'OEBS',
    })
    expect(resultat[1].fagsystemLabel).toBe('Hotsak')
    expect(resultat[1].valg).toEqual({
      sakstype: JournalføringSakstype.FAGSAK,
      sakId: 'hotsak-1',
      fagsaksystem: 'HOTSAK',
    })
  })

  it('prioriterer åpne Hotsak-saker ved lik dato', () => {
    const resultat = lagSakvalg(
      [
        sak('lukket', '2024-08-20T07:54:14Z', Saksstatus.FERDIGBEHANDLET),
        sak('åpen', '2024-08-20T07:54:14Z', Saksstatus.AVVENTER_SAKSBEHANDLER),
      ],
      []
    )

    expect(resultat.map(({ sakId }) => sakId)).toEqual(['åpen', 'lukket'])
  })

  it('filtrerer bort irrelevante eller ufullstendige saker', () => {
    const resultat = lagSakvalg(
      [sak('bestilling', '2025-01-01T00:00:00Z', Saksstatus.FERDIGBEHANDLET, Sakstype.BESTILLING)],
      [
        { ...fagsak('feil-tema'), tema: 'AAP' },
        { ...fagsak('hjelpemidler', 'HJELPEMIDLER'), tema: 'HJE' },
        { ...fagsak('barnebriller', 'BARNEBRILLER'), tema: 'HJE' },
        { ...fagsak('mangler-id'), fagsakId: undefined },
      ]
    )

    expect(resultat).toEqual([])
  })

  it('beholder alle saker og ignorerer fagsaker for barnebrillesøknader', () => {
    const resultat = lagSakvalg(
      [sak('barnebriller', '2025-01-01T00:00:00Z', Saksstatus.MOTTATT, Sakstype.BARNEBRILLER)],
      [fagsak('1234A01')],
      true
    )

    expect(resultat.map(({ sakId }) => sakId)).toEqual(['barnebriller'])
  })
})

describe('useKobleTilSak', () => {
  const standardrespons = { isLoading: false, isValidating: false, error: undefined, mutate: vi.fn() }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSaksoversikt).mockReturnValue({ ...standardrespons, saksoversikt: undefined })
  })

  it.each(BREVKODE_BRILLER_TIL_BARN)('henter åpne barnebrillesaker for brevkode %s', (brevkode) => {
    vi.mocked(useSaksoversikt).mockReturnValue({
      ...standardrespons,
      saksoversikt: {
        saker: [sak('barnebriller', '2025-01-01T00:00:00Z', Saksstatus.MOTTATT, Sakstype.BARNEBRILLER)],
        fagsaker: [fagsak('1234A01')],
        barnebrillekrav: [],
        barnebrillekravHentet: true,
      },
    })

    const { result } = renderHook(() => useKobleTilSak('12345678901', brevkode))

    expect(useSaksoversikt).toHaveBeenCalledWith('12345678901', SaksstatusKategori.ÅPEN, Sakstype.BARNEBRILLER)
    expect(result.current.saker.map(({ sakId }) => sakId)).toEqual(['barnebriller'])
    expect(result.current.antallSaker).toBe(1)
  })

  it('henter ordinær saksoversikt når brevkoden ikke gjelder barnebriller', () => {
    const { result } = renderHook(() => useKobleTilSak('12345678901', 'ANNEN'))

    expect(useSaksoversikt).toHaveBeenCalledWith('12345678901', undefined, undefined)
    expect(result.current.antallSaker).toBeUndefined()
  })
})

describe('erFagsak', () => {
  it('regner sakvalg fra Hotsak som intern sak', () => {
    expect(erFagsak({ sakstype: JournalføringSakstype.FAGSAK, sakId: 'hotsak-1', fagsaksystem: 'HOTSAK' })).toBe(false)
  })

  it('regner sakvalg med fagsaksystemkode som ekstern fagsak', () => {
    expect(erFagsak({ sakstype: JournalføringSakstype.FAGSAK, sakId: '1234A01', fagsaksystem: 'IT01' })).toBe(true)
    expect(erFagsak({ sakstype: JournalføringSakstype.FAGSAK, sakId: '1234B01', fagsaksystem: 'OEBS' })).toBe(true)
  })

  it('utleder ekstern fagsak direkte fra sakvalgene', () => {
    const [fagsakvalg, hotsakvalg] = lagSakvalg(
      [sak('hotsak-1', '2024-08-21T07:54:14Z', Saksstatus.AVVENTER_SAKSBEHANDLER)],
      [{ ...fagsak('1234B01', 'OEBS'), datoOpprettet: '2024-08-22T07:54:14Z' }]
    )

    expect(erFagsak(fagsakvalg.valg)).toBe(true)
    expect(erFagsak(hotsakvalg.valg)).toBe(false)
  })
})
