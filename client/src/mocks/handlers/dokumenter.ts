import { http, HttpResponse } from 'msw'

import type { DokumentsøkRequest, DokumentsøkResponse } from '../../dokument/useDokumentsøk.ts'
import type { JournalføringRequest, JournalføringResponse } from '../../journalføring/journalføringTypes.ts'
import { type Oppgave, Oppgavetype, Statuskategori } from '../../oppgave/oppgaveTypes.ts'
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

function tilJournalføringOppgave(oppgave: Oppgave): JournalføringResponse['oppgaver'][number] {
  return {
    oppgaveId: oppgave.oppgaveId,
    oppgavetype: oppgave.kategorisering.oppgavetype,
    statuskategori: oppgave.statuskategori,
    isÅpen: oppgave.statuskategori === Statuskategori.ÅPEN,
    isAvsluttet: oppgave.statuskategori === Statuskategori.AVSLUTTET,
  }
}

export const dokumentHandlers: StoreHandlersFactory = ({ journalpostStore, sakStore, oppgaveStore }) => [
  http.post<never, DokumentsøkRequest, DokumentsøkResponse>(`/api/dokumenter/sok`, async ({ request }) => {
    const { pageNumber = 1, pageSize = 100, cursor, fraDato, tilDato } = await request.json()
    const alle = (await journalpostStore.søk()).filter((it) => {
      if (fraDato && it.journalpostOpprettetTid < fraDato) return false
      if (tilDato && it.journalpostOpprettetTid.slice(0, 10) > tilDato) return false
      return true
    })
    const start = cursor ? alle.findIndex((it) => it.journalpostId === cursor) + 1 : 0
    const journalposter = alle.slice(start, start + pageSize)
    await delay(200)
    const hasNext = start + pageSize < alle.length
    return HttpResponse.json({
      journalposter,
      cursor: journalposter[journalposter.length - 1]?.journalpostId ?? null,
      pageNumber,
      pageSize,
      totalElements: alle.length,
      totalPages: 1,
      isFirst: true,
      isLast: !hasNext,
      hasPrevious: pageNumber > 1,
      hasNext,
    })
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

  http.post<JournalpostParams, JournalføringRequest>(
    `/api/journalpost/:journalpostId/journalforing`,
    async ({ request }) => {
      const body = await request.json()
      await delay(500)

      // ny sak — har saksgrunnlag, oppretter ny hjelpemiddelsak og behandle-sak-oppgave
      if ('saksgrunnlag' in body) {
        const journalføringRequest = body as JournalføringRequest
        await journalpostStore.journalfør(journalføringRequest)
        const { sakId, sak } = await sakStore.opprettJournalføringSak(journalføringRequest)
        await sakStore.leggTilInngåendeSaksdokumenter(sakId, journalføringRequest.journalpostId)
        const { saksgrunnlag } = journalføringRequest
        if (!saksgrunnlag) {
          throw new Error('saksgrunnlag mangler i journalføringsrequest med ny sak')
        }
        const nyOppgave = lagOppgave(sak as LagretHjelpemiddelsak, {
          oppgavetype: Oppgavetype.BEHANDLE_SAK,
          behandlingstema: {
            kode: saksgrunnlag.behandlingstema,
            term: saksgrunnlag.behandlingstema,
          },
          behandlingstype: {
            kode: saksgrunnlag.behandlingstype,
            term: saksgrunnlag.behandlingstype,
          },
          tema: saksgrunnlag.tema,
        })
        await Promise.all([
          oppgaveStore.lagreOppgave(nyOppgave),
          oppgaveStore.ferdigstillOppgave(journalføringRequest.oppgaveId),
        ])
        const oppgaver = await oppgaveStore.finnOppgaverForSak(sakId)
        return HttpResponse.json<JournalføringResponse>({
          sakId,
          oppgaver: oppgaver.map(tilJournalføringOppgave),
        })
      }

      // koble til eksisterende sak — har dokumenter-array og sakId, ingen saksgrunnlag
      if ('dokumenter' in body) {
        const v2Request = body as JournalføringRequest
        if (!v2Request.sak) {
          throw new Error('sak objekt mangler i koble-til-sak-request')
        }
        await journalpostStore.journalfør(v2Request)
        await sakStore.knyttJournalpostTilSak(v2Request)
        await sakStore.leggTilInngåendeSaksdokumenter(v2Request.sak.fagsakId ?? '', v2Request.journalpostId)
        await oppgaveStore.ferdigstillOppgave(v2Request.oppgaveId)
        const oppgaver = await oppgaveStore.finnOppgaverForSak(v2Request.sak.fagsakId ?? '')
        return HttpResponse.json<JournalføringResponse>({
          sakId: v2Request.sak.fagsakId ?? '',
          oppgaver: oppgaver.map(tilJournalføringOppgave),
        })
      }
    }
  ),
]
