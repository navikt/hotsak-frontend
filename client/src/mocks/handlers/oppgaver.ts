import { http, HttpResponse } from 'msw'

import type { OppgavelisteResponse } from '../../oppgaveliste/useOppgaveliste.ts'
import type { OppgaveApiResponse } from '../../types/experimentalTypes.ts'
import { Oppgave, OppgaveStatusType, Oppgavetype, SakerFilter } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import { delay, respondNoContent } from './response.ts'
import { erSakOppgaveId, OppgaveId, oppgaveIdUtenPrefix } from '../../oppgave/oppgaveId.ts'
import type { Oppgavebehandlere } from '../../oppgave/useOppgavebehandlere.ts'
import { calculateOffset, calculateTotalPages } from '../../felleskomponenter/Page.ts'

export const oppgaveHandlers: StoreHandlersFactory = ({ oppgaveStore, sakStore, saksbehandlerStore }) => [
  http.get(`/api/oppgaver-v2`, async ({ request }) => {
    const url = new URL(request.url)
    const oppgavetype = url.searchParams.get('oppgavetype')
    const pageNumber = +(url.searchParams.get('page') ?? 1)
    const pageSize = +(url.searchParams.get('limit') ?? 10)
    const offset = calculateOffset({ pageNumber, pageSize })

    await delay(200)
    const alleOppgaver = await oppgaveStore.alle()
    if (oppgavetype === 'JOURNALFØRING') {
      const journalføringsoppgaver = alleOppgaver.filter((oppgave) => oppgave.oppgavetype === Oppgavetype.JOURNALFØRING)
      const totalElements = journalføringsoppgaver.length
      const pagedOppgaver: OppgaveApiResponse = {
        oppgaver: journalføringsoppgaver.slice(offset, offset + pageSize),
        pageNumber,
        pageSize,
        totalPages: calculateTotalPages({ pageNumber, pageSize, totalElements }),
        totalElements,
      }
      return HttpResponse.json(pagedOppgaver)
    } else {
      const totalElements = alleOppgaver.length
      const pagedOppgaver: OppgaveApiResponse = {
        oppgaver: alleOppgaver.slice(offset, offset + pageSize),
        pageNumber,
        pageSize,
        totalPages: calculateTotalPages({ pageNumber, pageSize, totalElements }),
        totalElements,
      }
      return HttpResponse.json(pagedOppgaver)
    }
  }),

  http.get<never, never, Oppgavebehandlere>('/api/oppgaver-v2/:oppgaveId/behandlere', async () => {
    const behandlere = await saksbehandlerStore.alle()
    await delay(75)
    return HttpResponse.json({ behandlere })
  }),

  http.post<{ oppgaveId: OppgaveId }>(`/api/oppgaver-v2/:oppgaveId/tildeling`, async ({ params }) => {
    const { oppgaveId } = params
    if (erSakOppgaveId(oppgaveId)) {
      await sakStore.tildel(oppgaveIdUtenPrefix(oppgaveId))
    } else {
      await oppgaveStore.tildel(oppgaveId)
    }
    await delay(200)
    return respondNoContent()
  }),

  http.delete<{ oppgaveId: OppgaveId }>(`/api/oppgaver-v2/:oppgaveId/tildeling`, async ({ params }) => {
    const { oppgaveId } = params
    if (erSakOppgaveId(oppgaveId)) {
      await sakStore.frigi(oppgaveIdUtenPrefix(oppgaveId))
    }
    await delay(200)
    return respondNoContent()
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

    const haster = (oppgave: Oppgave) => oppgave.hast?.årsaker?.length || 0

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
