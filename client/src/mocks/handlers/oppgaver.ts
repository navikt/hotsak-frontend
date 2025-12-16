import { http, HttpResponse } from 'msw'

import { calculateOffset, calculateTotalPages } from '../../felleskomponenter/Page.ts'
import {
  erInternOppgaveId,
  type OppgaveId,
  oppgaveIdUtenPrefix,
  Oppgavetype,
  type OppgaveV1,
  OppgaveV2,
} from '../../oppgave/oppgaveTypes.ts'
import { type Oppgavebehandlere } from '../../oppgave/useOppgavebehandlere.ts'
import { type OppgavelisteResponse } from '../../oppgaveliste/v1/useOppgavelisteV1.ts'
import { OppgaveStatusType, SakerFilter } from '../../types/types.internal.ts'
import { type StoreHandlersFactory } from '../data'
import { delay, respondNoContent, respondNotFound } from './response.ts'
import { compareBy, type Direction } from '../../utils/array.ts'

export interface OppgaveParams {
  oppgaveId: OppgaveId
}

export const oppgaveHandlers: StoreHandlersFactory = ({ oppgaveStore, sakStore, saksbehandlerStore }) => [
  http.get(`/api/oppgaver-v2`, async ({ request }) => {
    const url = new URL(request.url)

    await delay(200)

    const meg = await saksbehandlerStore.innloggetSaksbehandler()
    const alleOppgaver = await oppgaveStore.alle()
    const filtrerteOppgaver = alleOppgaver
      .filter((oppgave) => {
        const oppgavetype = url.searchParams.get('oppgavetype')
        if (oppgavetype === Oppgavetype.JOURNALFØRING) {
          return oppgave.kategorisering.oppgavetype === Oppgavetype.JOURNALFØRING
        } else {
          return oppgave.kategorisering.oppgavetype !== Oppgavetype.JOURNALFØRING
        }
      })
      .filter((oppgave) => {
        switch (url.searchParams.get('tildelt')) {
          case 'MEG':
            return oppgave.tildeltSaksbehandler?.id === meg.id
          case 'INGEN':
            return oppgave.tildeltSaksbehandler == null
          case 'MEDARBEIDER':
            return oppgave.tildeltSaksbehandler != null
          default:
            return true
        }
      })
      .sort((a, b) => {
        let key: 'fristFerdigstillelse' | 'opprettetTidspunkt' = 'fristFerdigstillelse'
        switch (url.searchParams.get('sorteringsfelt')) {
          case 'FRIST':
            key = 'fristFerdigstillelse'
            break
          case 'OPPRETTET_TIDSPUNKT':
            key = 'opprettetTidspunkt'
            break
        }
        const direction = (url.searchParams.get('sorteringsrekkefølge') ?? 'none') as Direction
        const comparator = compareBy<OppgaveV2, 'fristFerdigstillelse' | 'opprettetTidspunkt'>(key, direction)
        return comparator(a, b)
      })

    const pageNumber = +(url.searchParams.get('page') ?? 1)
    const pageSize = +(url.searchParams.get('limit') ?? 1_000)
    const offset = calculateOffset({ pageNumber, pageSize })
    const totalElements = filtrerteOppgaver.length
    return HttpResponse.json({
      oppgaver: filtrerteOppgaver.slice(offset, offset + pageSize),
      pageNumber,
      pageSize,
      totalPages: calculateTotalPages({ pageNumber, pageSize, totalElements }),
      totalElements,
    })
  }),

  http.get<OppgaveParams>('/api/oppgaver-v2/:oppgaveId', async ({ params }) => {
    const { oppgaveId } = params
    const oppgave = await oppgaveStore.hent(oppgaveId)
    await delay(75)
    if (!oppgave) {
      return respondNotFound()
    }
    return HttpResponse.json(oppgave)
  }),

  http.get<never, never, Oppgavebehandlere>('/api/oppgaver-v2/:oppgaveId/behandlere', async () => {
    const behandlere = await saksbehandlerStore.alle()
    await delay(75)
    return HttpResponse.json({ behandlere })
  }),

  http.get<never, never, any[]>('/api/oppgaver-v2/:oppgaveId/kommentarer', async () => {
    await delay(75)
    return HttpResponse.json([])
  }),

  http.post<OppgaveParams>(`/api/oppgaver-v2/:oppgaveId/tildeling`, async ({ params }) => {
    const { oppgaveId } = params
    await oppgaveStore.tildel(oppgaveId)
    if (!erInternOppgaveId(oppgaveId)) {
      await sakStore.tildel(oppgaveIdUtenPrefix(oppgaveId))
    }
    await delay(200)
    return respondNoContent()
  }),

  http.delete<OppgaveParams>(`/api/oppgaver-v2/:oppgaveId/tildeling`, async ({ params }) => {
    const { oppgaveId } = params
    await oppgaveStore.fjernTildeling(oppgaveId)
    if (!erInternOppgaveId(oppgaveId)) {
      await sakStore.fjernTildeling(oppgaveIdUtenPrefix(oppgaveId))
    }
    await delay(200)
    return respondNoContent()
  }),

  http.put<OppgaveParams, { behandlingstema?: string }>(`/api/oppgaver-v2/:oppgaveId`, async ({ request, params }) => {
    const { behandlingstema } = await request.json()
    const { oppgaveId } = params
    if (!behandlingstema) {
      return respondNoContent()
    }
    await oppgaveStore.oppdaterKategorisering(oppgaveId, behandlingstema)
    await delay(200)
    return respondNoContent()
  }),

  http.get<OppgaveParams>(`/api/oppgaver-v2/:oppgaveId/gjelder`, async ({ params }) => {
    const { oppgaveId } = params
    const result = await oppgaveStore.hentGjelderInfo(oppgaveId)
    const { behandlingstema, behandlingstype, alternativer } = result ?? {
      behandlingstema: undefined,
      behandlingstype: undefined,
      alternativer: undefined,
    }
    await delay(75)
    return HttpResponse.json({
      behandlingstema,
      behandlingstype,
      alternativer,
    })
  }),

  http.get(`/api/oppgaver`, async ({ request }) => {
    const url = new URL(request.url)
    const statusFilter = url.searchParams.get('status')
    const sakerFilter = url.searchParams.get('saksbehandler')
    const områdeFilter = url.searchParams.get('område')
    const sakstypeFilter = url.searchParams.get('type')
    const hasteFilter = url.searchParams.get('hast')
    const pageNumber = Number(url.searchParams.get('page'))
    const pageSize = Number(url.searchParams.get('limit'))

    const startIndex = pageNumber - 1
    const endIndex = startIndex + pageSize
    const oppgaver = await sakStore.oppgaver()

    const filtrerteOppgaver = oppgaver
      .filter((oppgave) => (hasteFilter !== null ? oppgave.hast : true))
      .filter((oppgave) => (statusFilter ? oppgave.status === statusFilter : true))
      .filter((oppgave) =>
        sakerFilter && sakerFilter === SakerFilter.MINE ? oppgave.saksbehandler?.navn === 'Silje Saksbehandler' : true
      )
      .filter((oppgave) =>
        sakerFilter && sakerFilter === SakerFilter.UFORDELTE
          ? oppgave.status === OppgaveStatusType.AVVENTER_SAKSBEHANDLER
          : true
      )
      .filter((oppgave) =>
        områdeFilter ? oppgave.bruker.funksjonsnedsettelser.includes(områdeFilter.toLowerCase()) : true
      )
      .filter((oppgave) => (sakstypeFilter ? oppgave.sakstype.toLowerCase() === sakstypeFilter.toLowerCase() : true))

    const filterApplied = oppgaver.length !== filtrerteOppgaver.length

    const haster = (oppgave: OppgaveV1) => oppgave.hast?.årsaker?.length || 0

    const response: OppgavelisteResponse = {
      oppgaver: !filterApplied ? oppgaver.slice(startIndex, endIndex) : filtrerteOppgaver.slice(startIndex, endIndex),
      pageNumber,
      pageSize,
      totalPages: 1,
      totalElements: !filterApplied ? oppgaver.length : filtrerteOppgaver.length,
      antallHaster: !filterApplied ? oppgaver.filter(haster).length : filtrerteOppgaver.filter(haster).length,
    }

    return HttpResponse.json(response)
  }),
]
