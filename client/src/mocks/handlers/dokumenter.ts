import { http, HttpResponse } from 'msw'

import type { DokumentsøkRequest } from '../../dokument/useDokumentsøk.ts'
import type {
  JournalførJournalpostRequest,
  JournalføringV2Request,
  JournalføringV2Response,
} from '../../journalføring/journalføringTypes.ts'
import { Oppgavetype } from '../../oppgave/oppgaveTypes.ts'
import type { StoreHandlersFactory } from '../data'
import { velgDokumentFil } from '../data/dokumentvelger.ts'
import { lastDokument } from '../data/felles.ts'
import { lagOppgave } from '../data/lagOppgave.ts'
import type { LagretHjelpemiddelsak } from '../data/lagSak.ts'
import { delay, respondForbidden, respondInternalServerError, respondNotFound, respondPdf } from './response.ts'

interface JournalpostParams {
  journalpostId: string
}

interface DokumentParams extends JournalpostParams {
  dokumentId: string
}

export const dokumentHandlers: StoreHandlersFactory = ({ journalpostStore, sakStore, oppgaveStore }) => [
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

  http.post<JournalpostParams, JournalførJournalpostRequest | JournalføringV2Request>(
    `/api/journalpost/:journalpostId/journalforing`,
    async ({ request }) => {
      const body = await request.json()
      await delay(500)

      // V2 journalføring — har saksgrunnlag, oppretter ny hjelpemiddelsak og behandle-sak-oppgave
      if ('saksgrunnlag' in body) {
        const v2 = body as JournalføringV2Request
        await journalpostStore.journalfør(v2.journalpostId, v2.tittel)
        const { sakId, sak } = await sakStore.opprettJournalføringsSak(v2)
        const nyOppgave = lagOppgave(sak as LagretHjelpemiddelsak, {
          oppgavetype: Oppgavetype.BEHANDLE_SAK,
          behandlingstema: { kode: v2.saksgrunnlag.behandlingstema, term: v2.saksgrunnlag.behandlingstema },
          behandlingstype: { kode: v2.saksgrunnlag.behandlingstype, term: v2.saksgrunnlag.behandlingstype },
          tema: v2.saksgrunnlag.tema,
        })
        const [oppgaveId] = await Promise.all([
          oppgaveStore.lagreOppgave(nyOppgave),
          oppgaveStore.ferdigstillOppgave(v2.oppgaveId),
        ])
        return HttpResponse.json<JournalføringV2Response>({ sakId, oppgaveId: String(oppgaveId) })
      }

      // Eksisterende barnebrille-journalføring — uendret
      const journalføring = body as JournalførJournalpostRequest
      const eksisterendeSakId = journalføring.sakId
      const tittel = journalføring.tittel
      await journalpostStore.journalfør(journalføring.journalpostId, tittel)

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
