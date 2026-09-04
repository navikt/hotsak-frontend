import { describe, expect, it } from 'vitest'

import { type Fagsak, type SaksoversiktSak } from '../personoversikt/saksoversiktTypes.ts'
import { OppgaveStatusType, Sakstype } from '../types/types.internal.ts'
import { lagSakvalg } from './useKobleTilSak.ts'

const sak = (
  sakId: string,
  dato: string,
  saksstatus: OppgaveStatusType,
  sakstype = Sakstype.SØKNAD
): SaksoversiktSak => ({
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
      [sak('hotsak-1', '2024-08-21T07:54:14Z', OppgaveStatusType.AVVENTER_SAKSBEHANDLER)],
      [fagsak('1234A01'), { ...fagsak('1234B01', 'OEBS'), datoOpprettet: '2024-08-22T07:54:14Z' }]
    )

    expect(resultat.map(({ sakId }) => sakId)).toEqual(['1234B01', 'hotsak-1', '1234A01'])
    expect(resultat[0].fagsystemLabel).toBe('OEBS')
    expect(resultat[1].fagsystemLabel).toBe('Hotsak')
  })

  it('prioriterer åpne Hotsak-saker ved lik dato', () => {
    const resultat = lagSakvalg(
      [
        sak('lukket', '2024-08-20T07:54:14Z', OppgaveStatusType.HENLAGT),
        sak('åpen', '2024-08-20T07:54:14Z', OppgaveStatusType.AVVENTER_SAKSBEHANDLER),
      ],
      []
    )

    expect(resultat.map(({ sakId }) => sakId)).toEqual(['åpen', 'lukket'])
  })

  it('filtrerer bort irrelevante eller ufullstendige saker', () => {
    const resultat = lagSakvalg(
      [sak('bestilling', '2025-01-01T00:00:00Z', OppgaveStatusType.FERDIGSTILT, Sakstype.BESTILLING)],
      [
        { ...fagsak('feil-tema'), tema: 'AAP' },
        { ...fagsak('hjelpemidler', 'HJELPEMIDLER'), tema: 'HJE' },
        { ...fagsak('barnebriller', 'BARNEBRILLER'), tema: 'HJE' },
        { ...fagsak('mangler-id'), fagsakId: undefined },
      ]
    )

    expect(resultat).toEqual([])
  })
})
