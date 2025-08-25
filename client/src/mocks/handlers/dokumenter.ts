import { http, HttpResponse } from 'msw'

import type { JournalføringResponse } from '../../journalføring/useJournalføringActions.ts'
import type { JournalføringRequest } from '../../types/types.internal.ts'
import type { StoreHandlersFactory } from '../data'
import { lastDokument, lastDokumentBarnebriller } from '../data/felles.ts'
import { delay, respondForbidden, respondInternalServerError, respondNotFound, respondPdf } from './response.ts'

interface JournalpostParams {
  journalpostId: string
}

interface DokumentParams extends JournalpostParams {
  dokumentId: string
}

export const dokumentHandlers: StoreHandlersFactory = ({ oppgaveStore, journalpostStore, sakStore }) => [
  http.get<JournalpostParams>(`/api/journalpost/:journalpostId`, async ({ params }) => {
    const journalpostId = params.journalpostId
    const journalpost = await journalpostStore.hent(journalpostId)
    const oppgave = (await oppgaveStore.finnOppgaveForJournalpostId(journalpostId)) || null

    await delay(200)
    if (journalpost) {
      if (oppgave) {
        journalpost.oppgave = oppgave
      }

      return HttpResponse.json(journalpost)
    } else if (journalpostId === '403') {
      return respondForbidden()
    } else if (journalpostId === '500') {
      return respondInternalServerError()
    } else {
      return respondNotFound()
    }
  }),

  http.get<DokumentParams>(`/api/journalpost/:journalpostId/:dokumentId`, async ({ params }) => {
    const dokumentId = params.dokumentId

    let buffer
    switch (dokumentId) {
      case '2':
        buffer = await lastDokumentBarnebriller('kvittering')
        break
      case '3':
        buffer = await lastDokumentBarnebriller('brilleseddel')
        break
      case '4':
        buffer = await lastDokumentBarnebriller('kvitteringsside')
        break
      case '6':
        buffer = await lastDokument('journalført_notat')
        break
      case '5':
      default:
        buffer = await lastDokumentBarnebriller('søknad')
        break
    }

    await delay(500)
    return respondPdf(buffer)
  }),

  http.post<JournalpostParams, JournalføringRequest, JournalføringResponse>(
    `/api/journalpost/:journalpostId/journalforing`,
    async ({ request }) => {
      const journalføring = await request.json()

      const eksisterendeSakId = journalføring.sakId
      const tittel = journalføring.tittel

      await journalpostStore.journalfør(journalføring.journalpostId, tittel)
      await delay(500)

      if (eksisterendeSakId) {
        await sakStore.knyttJournalpostTilSak(journalføring)
        await sakStore.tildel(eksisterendeSakId)
        return HttpResponse.json({ sakId: eksisterendeSakId })
      } else {
        const sakId = await sakStore.opprettSak(journalføring)
        await sakStore.tildel(sakId)

        return HttpResponse.json({ sakId: sakId.toString(), oppgaveId: `E-${sakId}` })
      }
    }
  ),
]
