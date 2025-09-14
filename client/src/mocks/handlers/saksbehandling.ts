import { http, HttpResponse } from 'msw'

import {
  EndretHjelpemiddelRequest,
  OppgaveStatusType,
  StegType,
  TilgangResultat,
  TilgangType,
  VedtakPayload,
} from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import { hentJournalførteNotater } from '../data/journalførteNotater'
import { erLagretBarnebrillesak, erLagretHjelpemiddelsak } from '../data/lagSak.ts'
import type { SakParams } from './params'
import {
  delay,
  respondForbidden,
  respondInternalServerError,
  respondNoContent,
  respondNotFound,
  respondUnauthorized,
} from './response'

export const saksbehandlingHandlers: StoreHandlersFactory = ({
  sakStore,
  journalpostStore,
  saksbehandlerStore,
  endreHjelpemiddelStore,
}) => [
  http.get<SakParams>(`/api/sak/:sakId`, async ({ params }) => {
    const { sakId } = params
    if (sakId === '401') {
      return respondUnauthorized()
    }
    if (sakId === '403') {
      return respondForbidden()
    }
    if (sakId === '500') {
      return respondInternalServerError()
    }
    await delay(500)

    const sak = await sakStore.hent(sakId)
    const { navn: bruker } = await saksbehandlerStore.innloggetSaksbehandler()
    const harSkrivetilgang = bruker !== 'Lese Visningsrud'

    const tilganger = {
      [TilgangType.KAN_BEHANDLE_SAK]: harSkrivetilgang ? TilgangResultat.TILLAT : TilgangResultat.NEKT,
    }

    if (erLagretHjelpemiddelsak(sak)) {
      return HttpResponse.json({
        kanTildeles: sak.status === OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
        data: sak,
        tilganger,
      })
    }

    if (erLagretBarnebrillesak(sak)) {
      return HttpResponse.json({
        tilganger,
        kanTildeles:
          sak.status === OppgaveStatusType.AVVENTER_SAKSBEHANDLER ||
          sak.status === OppgaveStatusType.AVVENTER_GODKJENNER,
        data: sak,
      })
    }

    return respondNotFound()
  }),

  http.get<SakParams>(`/api/sak/:sakId/historikk`, async ({ params }) => {
    const { sakId } = params
    const hendelser = await sakStore.hentHendelser(sakId)
    await delay(500)
    return HttpResponse.json(hendelser)
  }),

  http.get<SakParams>(`/api/sak/:sakId/dokumenter`, async ({ request, params }) => {
    const { sakId } = params
    const url = new URL(request.url)
    const dokumentType = url.searchParams.get('type')

    if (dokumentType == 'NOTAT') {
      await delay(500)
      return HttpResponse.json(hentJournalførteNotater(sakId))
    }

    /*
      Hvis ingen type er angitt som query param, bruker vi gammel oppførsel som henter journalposter fra sak.
      Ligger her for å bevare bakoverkompatibilitet
      På sikt skal vi vekk fra dette og heller hente innkommende journalposter fra sak hentet fra Joark.
    */
    if (!dokumentType) {
      const sak = await sakStore.hent(sakId)
      if (!sak) {
        return respondNotFound()
      }

      let journalposter: string[]
      if (erLagretBarnebrillesak(sak)) {
        journalposter = sak.journalposter
      } else {
        journalposter = []
      }
      const dokumenter = await Promise.all(
        journalposter.map(async (journalpostId) => {
          const journalpostDokument = await journalpostStore.hent(journalpostId)
          if (journalpostDokument) {
            return journalpostDokument.dokumenter
          }
        })
      )

      return HttpResponse.json(dokumenter.flat())
    } else {
      const saksdokumenter = await sakStore.hentSaksdokumenter(sakId) // dokumentType
      return HttpResponse.json(saksdokumenter)
    }
  }),

  http.put<SakParams, VedtakPayload>('/api/sak/:sakId/vedtak', async ({ params }) => {
    const sakId = params.sakId
    await sakStore.fattVedtak(sakId)
    return respondNoContent()
  }),

  http.put<SakParams>('/api/sak/:sakId/tilbakeforing', async ({ params }) => {
    const sakId = params.sakId
    await sakStore.oppdaterStatus(sakId, OppgaveStatusType.SENDT_GOSYS)
    return respondNoContent()
  }),

  http.put<SakParams, { status: OppgaveStatusType }>('/api/sak/:sakId/status', async ({ request, params }) => {
    const sakId = params.sakId
    const { status } = await request.json()
    await sakStore.oppdaterStatus(sakId, status)
    await sakStore.lagreHendelse(sakId, 'Fortsetter behandling av sak')
    return respondNoContent()
  }),

  http.post<SakParams>('/api/sak/:sakId/vilkarsvurdering', async ({ params }) => {
    await sakStore.oppdaterSteg(params.sakId, StegType.FATTE_VEDTAK)
    return respondNoContent()
  }),

  http.post<SakParams>('/api/sak/:sakId/henleggelse', async ({ params }) => {
    await sakStore.oppdaterStatus(params.sakId, OppgaveStatusType.HENLAGT)
    return respondNoContent()
  }),

  http.get<SakParams>('/api/sak/:sakId/hjelpemidler', async ({ params }) => {
    const endredeHjelpemidler = await endreHjelpemiddelStore.hent(params.sakId)

    const hjelpemidler = endredeHjelpemidler?.endredeHjelpemidler.map(
      (endretHjelpemiddel: EndretHjelpemiddelRequest) => {
        return {
          hjelpemiddelId: endretHjelpemiddel.hjelpemiddelId,
          hmsArtNr: endretHjelpemiddel.hmsArtNr,
          finnesIOebs: true,
          endretHjelpemiddel: {
            hjelpemiddelId: endretHjelpemiddel.hjelpemiddelId,
            begrunnelse: endretHjelpemiddel.begrunnelse,
            begrunnelseFritekst: endretHjelpemiddel.begrunnelseFritekst,
          },
        }
      }
    )

    if (!endredeHjelpemidler) {
      return respondNotFound()
    }

    return HttpResponse.json({ hjelpemidler })
  }),

  http.put<SakParams, EndretHjelpemiddelRequest>('/api/sak/:sakId/hjelpemidler', async ({ request, params }) => {
    await endreHjelpemiddelStore.endreHjelpemiddel(params.sakId, await request.json())
    return respondNoContent()
  }),
]
