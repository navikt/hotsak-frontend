import { useMemo } from 'react'

import { useSaksoversikt } from '../personoversikt/useSaksoversikt.ts'
import { type Fagsak, type SaksoversiktSak } from '../personoversikt/saksoversiktTypes.ts'
import { type HttpError } from '../io/HttpError.ts'
import { Fagsaksystem, Tema, type Fagsaksystem as FagsaksystemType } from '../kodeverk/kodeverkTypes.ts'
import {
  OppgaveStatusType,
  Sakstype,
  type OppgaveStatusType as OppgaveStatusTypeValue,
} from '../types/types.internal.ts'

export type Sakvalg = { kilde: 'hotsak'; sakId: string } | { kilde: 'fagsak'; sakId: string }

export interface SakvalgVisning {
  valg: Sakvalg
  sakId: string
  gjelder: string
  dato: string
  fagsystemLabel: string
  saksstatus?: OppgaveStatusTypeValue
  område?: string[]
}

export interface UseKobleTilSakResponse {
  saker: SakvalgVisning[]
  antallSaker?: number
  isLoading: boolean
  error?: HttpError
}

export const MAKS_SAKER_SYNLIG = 10
const ÅPNE_STATUSER = new Set<OppgaveStatusTypeValue>([
  OppgaveStatusType.AVVENTER_JOURNALFORING,
  OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
  OppgaveStatusType.TILDELT_SAKSBEHANDLER,
  OppgaveStatusType.AVVENTER_DOKUMENTASJON,
  OppgaveStatusType.AVVENTER_GODKJENNER,
  OppgaveStatusType.TILDELT_GODKJENNER,
])

function erVisbarSak(sak: SaksoversiktSak): boolean {
  return sak.sakstype !== Sakstype.BARNEBRILLER && sak.sakstype !== Sakstype.BESTILLING
}

function erVisbarFagsak(fagsak: Fagsak): fagsak is Fagsak & {
  fagsakId: string
  fagsaksystem: FagsaksystemType
  datoOpprettet: string
} {
  return (
    fagsak.tema === 'HJE' &&
    fagsak.fagsaksystem !== 'HJELPEMIDLER' &&
    fagsak.fagsaksystem !== 'BARNEBRILLER' &&
    Boolean(fagsak.fagsakId && fagsak.fagsaksystem && fagsak.datoOpprettet)
  )
}

function tilSakvalg(sak: SaksoversiktSak): SakvalgVisning {
  return {
    valg: { kilde: 'hotsak', sakId: sak.sakId },
    sakId: sak.sakId,
    gjelder: sak.gjelder,
    dato: sak.mottattTidspunkt,
    fagsystemLabel: 'Hotsak',
    saksstatus: sak.saksstatus,
    område: sak.område,
  }
}

function tilFagsakvalg(
  fagsak: Fagsak & { fagsakId: string; fagsaksystem: FagsaksystemType; datoOpprettet: string }
): SakvalgVisning {
  return {
    valg: { kilde: 'fagsak', sakId: fagsak.fagsakId },
    sakId: fagsak.fagsakId,
    gjelder: fagsak.tema ? Tema[fagsak.tema] : 'Hjelpemidler',
    dato: fagsak.datoOpprettet,
    fagsystemLabel: Fagsaksystem[fagsak.fagsaksystem],
  }
}

export function lagSakvalg(saker: SaksoversiktSak[], fagsaker: Fagsak[] = []): SakvalgVisning[] {
  return [...saker.filter(erVisbarSak).map(tilSakvalg), ...fagsaker.filter(erVisbarFagsak).map(tilFagsakvalg)].sort(
    (a, b) => {
      const datoDiff = b.dato.localeCompare(a.dato)
      if (datoDiff !== 0) return datoDiff
      if (a.saksstatus && b.saksstatus) {
        return Number(ÅPNE_STATUSER.has(b.saksstatus)) - Number(ÅPNE_STATUSER.has(a.saksstatus))
      }
      return 0
    }
  )
}

export function useKobleTilSak(fnr?: string): UseKobleTilSakResponse {
  const { saksoversikt, isLoading, error } = useSaksoversikt(fnr)
  const saker = useMemo(
    () => lagSakvalg(saksoversikt?.saker ?? [], saksoversikt?.fagsaker ?? []),
    [saksoversikt?.saker, saksoversikt?.fagsaker]
  )

  return {
    saker,
    antallSaker: saksoversikt ? saker.length : undefined,
    isLoading,
    error,
  }
}
