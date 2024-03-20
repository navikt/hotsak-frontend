import { delay, http, HttpResponse } from 'msw'

import {
  Artikkel,
  EndreHjelpemiddelRequest,
  OppgaveStatusType,
  SakerFilter,
  StegType,
  VedtakPayload,
} from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import {
  respondForbidden,
  respondInternalServerError,
  respondNotFound,
  respondOK,
  respondUnauthorized,
} from './response'

export const saksbehandlingHandlers: StoreHandlersFactory = ({ sakStore, barnebrillesakStore, journalpostStore }) => [
  http.post<{ sakId: string }>(`/api/sak/:sakId/tildeling`, async ({ params }) => {
    const { sakId } = params
    await delay(500)
    if (await sakStore.tildel(sakId)) {
      return respondOK()
    }
    if (await barnebrillesakStore.tildel(sakId)) {
      return respondOK()
    }
    return respondNotFound()
  }),

  http.delete<{ sakId: string }>(`/api/sak/:sakId/tildeling`, async ({ params }) => {
    const { sakId } = params
    if (await sakStore.frigi(sakId)) {
      return respondOK()
    }
    if (await barnebrillesakStore.frigi(sakId)) {
      return respondOK()
    }
    return respondNotFound()
  }),

  http.get<{ sakId: string }>(`/api/sak/:sakId`, async ({ params }) => {
    const { sakId } = params
    if (sakId === '666') {
      return respondForbidden()
    }
    if (sakId === '999') {
      return respondUnauthorized()
    }
    if (sakId === '500') {
      return respondInternalServerError()
    }

    const sak = await sakStore.hent(sakId)
    if (sak) {
      return HttpResponse.json({ kanTildeles: sak.status === OppgaveStatusType.AVVENTER_SAKSBEHANDLER, data: sak })
    }

    const barnebrillesak = await barnebrillesakStore.hent(sakId)
    if (barnebrillesak) {
      return HttpResponse.json({
        kanTildeles:
          barnebrillesak.status === OppgaveStatusType.AVVENTER_SAKSBEHANDLER ||
          barnebrillesak.status === OppgaveStatusType.AVVENTER_GODKJENNER,
        data: barnebrillesak,
      })
    }

    return respondNotFound()
  }),

  http.get<any, { sakId: string }, any>(`/api/sak/:sakId/historikk`, async ({ params }) => {
    const { sakId } = params
    const hendelser = await Promise.all([sakStore.hentHendelser(sakId), barnebrillesakStore.hentHendelser(sakId)])
    return HttpResponse.json(hendelser.flat())
  }),

  http.get<{ sakId: string }>(`/api/sak/:sakId/dokumenter`, async ({ request, params }) => {
    const { sakId } = params
    const url = new URL(request.url)
    const dokumentType = url.searchParams.get('type')

    // Hvis ingen type er angitt som query param, bruker gammel oppførsel som henter journalposter fra sak.
    // Ligger her for å bevare bakoverkompabilitet
    // På sikt skal vi vekk fra dette og heller hente innkommende journalposter fra sak hentet fra joark.
    if (!dokumentType) {
      const sak = await barnebrillesakStore.hent(sakId)
      if (!sak) {
        return respondNotFound()
      }

      const journalposter = sak.journalposter
      const dokumenter = await Promise.all(
        journalposter.map(async (journalpostID) => {
          const journalpostDokument = await journalpostStore.hent(journalpostID)
          if (journalpostDokument) {
            return journalpostDokument.dokumenter
          }
        })
      )

      return HttpResponse.json(dokumenter.flat())
    } else {
      const saksdokumenter = await barnebrillesakStore.hentSaksdokumenter(sakId) // dokumentType
      return HttpResponse.json(saksdokumenter)
    }
  }),

  http.put<{ sakId: string }, VedtakPayload>('/api/sak/:sakId/vedtak', async ({ request, params }) => {
    const sakId = params.sakId
    const { status } = await request.json()
    await sakStore.fattVedtak(sakId, OppgaveStatusType.VEDTAK_FATTET, status)
    return respondOK()
  }),

  http.put<{ sakId: string }>('/api/sak/:sakId/tilbakeforing', async ({ params }) => {
    const sakId = params.sakId
    await sakStore.oppdaterStatus(sakId, OppgaveStatusType.SENDT_GOSYS)
    return respondOK()
  }),

  http.put<{ sakId: string }, { status: OppgaveStatusType }>('/api/sak/:sakId/status', async ({ request, params }) => {
    const sakId = params.sakId
    const { status } = await request.json()
    await barnebrillesakStore.oppdaterStatus(sakId, status)
    await barnebrillesakStore.lagreHendelse(sakId, 'Fortsetter behandling av sak')
    return respondOK()
  }),

  http.get(`/api/oppgaver`, async ({ request }) => {
    const url = new URL(request.url)
    const statusFilter = url.searchParams.get('status')
    const sakerFilter = url.searchParams.get('saksbehandler')
    const områdeFilter = url.searchParams.get('område')
    const sakstypeFilter = url.searchParams.get('type')
    const currentPage = Number(url.searchParams.get('page'))
    const pageSize = Number(url.searchParams.get('limit'))

    const startIndex = currentPage - 1
    const endIndex = startIndex + pageSize
    const oppgaver = [...(await sakStore.oppgaver()), ...(await barnebrillesakStore.oppgaver())]
    const filtrerteOppgaver = oppgaver
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

    const response = {
      oppgaver: !filterApplied ? oppgaver.slice(startIndex, endIndex) : filtrerteOppgaver.slice(startIndex, endIndex),
      totalCount: !filterApplied ? oppgaver.length : filtrerteOppgaver.length,
      pageSize: pageSize,
      currentPage: currentPage,
    }

    return HttpResponse.json(response)
  }),

  http.post<{ sakId: string }>('/api/sak/:sakId/vilkarsvurdering', async ({ params }) => {
    await barnebrillesakStore.oppdaterSteg(params.sakId, StegType.FATTE_VEDTAK)
    return HttpResponse.json({})
  }),

  http.post<any, { sakId: string }, any>('/api/sak/:sakId/brevsending', async ({ params }) => {
    await barnebrillesakStore.lagreSaksdokument(params.sakId, 'Innhent opplysninger')
    await barnebrillesakStore.oppdaterStatus(params.sakId, OppgaveStatusType.AVVENTER_DOKUMENTASJON)
    await barnebrillesakStore.fjernBrevtekst(params.sakId)
    return HttpResponse.json({})
  }),

  http.get<{ sakId: string }, any, Artikkel[]>('/api/sak/:sakId/artikler', async ({ params }) => {
    const sak = await sakStore.hent(params.sakId)

    if (!sak) {
      return respondNotFound() as any // fixme
    }

    const artikler: Artikkel[] = sak?.hjelpemidler
      .map((hjelpemiddel) => {
        const artikkel: Artikkel = {
          hmsnr: hjelpemiddel.hmsnr,
          navn: hjelpemiddel.beskrivelse,
          antall: hjelpemiddel.antall,
          finnesIOebs: hjelpemiddel.hmsnr === '289689' ? false : true,
        }
        const tilbehørArtikler: Artikkel[] = hjelpemiddel.tilbehør.map((tilbehør) => {
          return { hmsnr: tilbehør.hmsNr, navn: tilbehør.navn, antall: tilbehør.antall, finnesIOebs: true }
        })
        return [artikkel, ...tilbehørArtikler]
      })
      .flat()

    return HttpResponse.json(artikler)
  }),
]
