import { http, HttpResponse } from 'msw'

import type { DokumentsøkRequest } from '../../dokument/useDokumentsøk.ts'
import type {
  JournalførJournalpostRequest,
  JournalførJournalpostResponse,
} from '../../journalføring/journalføringTypes.ts'
import type { StoreHandlersFactory } from '../data'
import { velgDokumentFil } from '../data/dokumentvelger.ts'
import { lastDokument } from '../data/felles.ts'
import { delay, respondForbidden, respondInternalServerError, respondNotFound, respondPdf } from './response.ts'

interface JournalpostParams {
  journalpostId: string
}

interface DokumentParams extends JournalpostParams {
  dokumentId: string
}

export const dokumentHandlers: StoreHandlersFactory = ({ journalpostStore, sakStore }) => [
  http.post<never, DokumentsøkRequest>(`/api/dokumenter/sok`, async () => {
    const journalposter = await journalpostStore.søk()
    await delay(200)
    return HttpResponse.json({ journalposter })
  }),

  http.get<JournalpostParams>(`/api/journalpost/:journalpostId`, async ({ params }) => {
    const journalpostId = params.journalpostId
    const journalpost = await journalpostStore.hent(journalpostId)
    await delay(200)
    if (journalpost) {
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
    const { filsti } = velgDokumentFil(params.journalpostId, params.dokumentId)
    const navn = filsti.replace('.pdf', '')

    const buffer = await lastDokument(navn)

    await delay(500)
    return respondPdf(buffer)
  }),

  http.post<JournalpostParams, JournalførJournalpostRequest, JournalførJournalpostResponse>(
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
        return HttpResponse.json({ oppgaveId: '1', sakId: eksisterendeSakId })
      } else {
        const sakId = await sakStore.opprettSak(journalføring)
        await sakStore.tildel(sakId)

        return HttpResponse.json({ sakId: sakId.toString(), oppgaveId: sakId })
      }
    }
  ),
]
