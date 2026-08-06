import { http, HttpResponse } from 'msw'

import type { DokumentsøkRequest, DokumentsøkResponse } from '../../dokument/useDokumentsøk.ts'
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
  http.post<never, DokumentsøkRequest, DokumentsøkResponse>(`/api/dokumenter/sok`, async ({ request }) => {
    const { første = 100, etter = null } = await request.json()
    const alle = await journalpostStore.søk()
    const start = etter ? alle.findIndex((j) => j.journalpostId === etter) + 1 : 0
    const side = alle.slice(start, start + første)
    const sideInfo = {
      sluttpeker: side[side.length - 1]?.journalpostId ?? null,
      finnesNesteSide: start + første < alle.length,
      antall: side.length,
      totaltAntall: alle.length,
    }
    await delay(200)
    return HttpResponse.json({ journalposter: side, sideInfo })
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
        const journalføringRequest = body as JournalføringV2Request

        if (!journalføringRequest) {
          throw new Error('Journalføring request payload mangler')
        }

        await journalpostStore.journalførV2(journalføringRequest)
        const { sakId, sak } = await sakStore.opprettJournalføringsSak(journalføringRequest)
        const nyOppgave = lagOppgave(sak as LagretHjelpemiddelsak, {
          oppgavetype: Oppgavetype.BEHANDLE_SAK,
          behandlingstema: {
            kode: journalføringRequest.saksgrunnlag.behandlingstema,
            term: journalføringRequest.saksgrunnlag.behandlingstema,
          },
          behandlingstype: {
            kode: journalføringRequest.saksgrunnlag.behandlingstype,
            term: journalføringRequest.saksgrunnlag.behandlingstype,
          },
          tema: journalføringRequest.saksgrunnlag.tema,
        })
        const [oppgaveId] = await Promise.all([
          oppgaveStore.lagreOppgave(nyOppgave),
          oppgaveStore.ferdigstillOppgave(journalføringRequest.oppgaveId),
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
