import { http, HttpResponse } from 'msw'

import { type ArtikkellinjeSak } from '../../sak/sakTypes.ts'
import { type EndreHjelpemiddelRequest } from '../../saksbilde/hjelpemidler/endreHjelpemiddel/endreHjelpemiddelTypes.ts'
import {
  OppgaveStatusType,
  StegType,
  TilgangResultat,
  TilgangType,
  type VedtakPayload,
} from '../../types/types.internal'
import { associateBy } from '../../utils/array.ts'
import { type StoreHandlersFactory } from '../data'
import { hentJournalførteNotater } from '../data/journalførteNotater'
import { erLagretBarnebrillesak, erLagretHjelpemiddelsak } from '../data/lagSak.ts'
import { BehandlingParams, type SakParams } from './params'
import {
  delay,
  respondBadRequest,
  respondForbidden,
  respondInternalServerError,
  respondNoContent,
  respondNotFound,
  respondUnauthorized,
} from './response'
import { BehandlingerResponse, LagreBehandlingRequest } from '../../types/behandlingTyper.ts'

export const saksbehandlingHandlers: StoreHandlersFactory = ({
  endreHjelpemiddelStore,
  journalpostStore,
  sakStore,
  saksbehandlerStore,
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
        kanTildeles: sak.saksstatus === OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
        data: sak,
        tilganger,
      })
    }

    if (erLagretBarnebrillesak(sak)) {
      return HttpResponse.json({
        tilganger,
        kanTildeles:
          sak.saksstatus === OppgaveStatusType.AVVENTER_SAKSBEHANDLER ||
          sak.saksstatus === OppgaveStatusType.AVVENTER_GODKJENNER,
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

  // TODO, denne kan fjeres når nye Hotsak er i bruk overalt
  http.put<SakParams, VedtakPayload>('/api/sak/:sakId/vedtak', async ({ params }) => {
    const sakId = params.sakId
    await sakStore.fattVedtak(sakId)
    return respondNoContent()
  }),

  http.put<SakParams, VedtakPayload>('/api/sak/:sakId/ferdigstilling', async ({ params }) => {
    const sakId = params.sakId
    const behandling = await sakStore.hentBehandlinger(sakId)
    if (!behandling || behandling.length === 0) {
      return respondBadRequest()
    }

    // TODO: Wip. Fortsett på dette
    //const gjeldendeBehandling = behandling[0]

    //const vedtaksResultat = gjeldendeBehandling.utfall?.utfall as VedtaksResultat

    await sakStore.fattVedtak(sakId)
    await sakStore.ferdigstillBehandlingForSak(sakId)
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

  http.get<SakParams, never, ArtikkellinjeSak[]>('/api/sak/:sakId/hjelpemidler', async ({ params }) => {
    const behovsmelding = await sakStore.hentBehovsmelding(params.sakId)
    if (!behovsmelding) {
      return respondNotFound()
    }

    const { endredeHjelpemidler } = await endreHjelpemiddelStore.hent(params.sakId)
    const endredeHjelpemidlerById = associateBy(endredeHjelpemidler, (it) => it.id)
    const hjelpemidler = behovsmelding.hjelpemidler.hjelpemidler.flatMap((hjelpemiddel): ArtikkellinjeSak[] => {
      const endretHjelpemiddel = endredeHjelpemidlerById[hjelpemiddel.hjelpemiddelId]
      return [
        {
          id: hjelpemiddel.hjelpemiddelId,
          hmsArtNr: endretHjelpemiddel?.hmsArtNr ?? hjelpemiddel.produkt.hmsArtNr,
          artikkelnavn: endretHjelpemiddel?.artikkelnavn ?? hjelpemiddel.produkt.artikkelnavn,
          antall: hjelpemiddel.antall,
          finnesIOebs: true,
          endretArtikkel: endretHjelpemiddel
            ? {
                id: endretHjelpemiddel.id,
                begrunnelse: endretHjelpemiddel.begrunnelse,
                begrunnelseFritekst: endretHjelpemiddel.begrunnelseFritekst,
              }
            : undefined,
          type: 'HJELPEMIDDEL',
        },
        ...hjelpemiddel.tilbehør.map((tilbehør): ArtikkellinjeSak => {
          const id = tilbehør.tilbehørId ?? ''
          const endretTilbehør = endredeHjelpemidlerById[id]
          return {
            id: tilbehør.tilbehørId ?? '',
            hmsArtNr: endretTilbehør?.hmsArtNr ?? tilbehør.hmsArtNr,
            artikkelnavn: endretTilbehør?.artikkelnavn ?? tilbehør.navn,
            antall: tilbehør.antall,
            finnesIOebs: true,
            endretArtikkel: endretTilbehør
              ? {
                  id: endretTilbehør.id,
                  begrunnelse: endretTilbehør.begrunnelse,
                  begrunnelseFritekst: endretTilbehør.begrunnelseFritekst,
                }
              : undefined,
            type: 'TILBEHØR',
          }
        }),
      ]
    })

    return HttpResponse.json(hjelpemidler)
  }),

  http.put<SakParams, EndreHjelpemiddelRequest>('/api/sak/:sakId/hjelpemidler', async ({ request, params }) => {
    await endreHjelpemiddelStore.endreHjelpemiddel(params.sakId, await request.json())
    return respondNoContent()
  }),
  http.post<SakParams, LagreBehandlingRequest>('/api/sak/:sakId/behandling', async ({ params, request }) => {
    await sakStore.opprettBehandling(params.sakId, await request.json())
  }),
  http.put<BehandlingParams, LagreBehandlingRequest>(
    '/api/sak/:sakId/behandling/:behandlingId',
    async ({ params, request }) => {
      await sakStore.lagreBehandling(params.behandlingId, await request.json())
    }
  ),
  http.get<SakParams, never, BehandlingerResponse>('/api/sak/:sakId/behandling', async ({ params }) => {
    const behandlinger = await sakStore.hentBehandlinger(params.sakId)
    return HttpResponse.json({ behandlinger })
  }),
]
