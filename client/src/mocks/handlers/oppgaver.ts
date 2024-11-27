import { delay, http, HttpResponse } from 'msw'

import type { OppgavelisteResponse } from '../../oppgaveliste/useOppgaveliste.ts'
import { OppgaveApiResponse } from '../../types/experimentalTypes.ts'
import { Oppgave, OppgaveStatusType, Oppgavetype, SakerFilter } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import { respondNoContent } from './response.ts'

export const oppgaveHandlers: StoreHandlersFactory = ({ oppgaveStore, sakStore, barnebrillesakStore }) => [
  http.get(`/api/oppgaver-v2`, async ({ request }) => {
    const url = new URL(request.url)
    const oppgavetype = url.searchParams.get('oppgavetype')

    await delay(200)
    if (oppgavetype === 'JOURNALFØRING') {
      const oppgaver = await oppgaveStore.alle()

      const pagedOppgaver: OppgaveApiResponse = {
        oppgaver: oppgaver.filter((oppgave) => oppgave.oppgavetype === Oppgavetype.JOURNALFØRING),
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1,
        totalElements: oppgaver.length,
      }
      return HttpResponse.json(pagedOppgaver)
    } else {
      const oppgaver = await oppgaveStore.alle()
      const pagedOppgaver: OppgaveApiResponse = {
        oppgaver: oppgaver,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1,
        totalElements: oppgaver.length,
      }
      return HttpResponse.json(pagedOppgaver)
    }
  }),
  http.post<{ oppgaveId: string }>(`/api/oppgaver-v2/:oppgaveId/tildeling`, async ({ params }) => {
    await oppgaveStore.tildel(params.oppgaveId)
    console.log(`Tildeler oppgave ${params.oppgaveId}`)

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
    const oppgaver = [...(await sakStore.oppgaver()), ...(await barnebrillesakStore.oppgaver())]

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
