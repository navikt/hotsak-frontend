import { rest } from 'msw'

import {
  EndreHjelpemiddelRequest,
  OppgaveStatusType,
  SakerFilter,
  StegType,
  VedtakPayload,
} from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'

export const saksbehandlingHandlers: StoreHandlersFactory = ({ sakStore, barnebrillesakStore, journalpostStore }) => [
  rest.post<any, { sakId: string }, any>(`/api/tildeling/:sakId`, async (req, res, ctx) => {
    const { sakId } = req.params
    if (await sakStore.tildel(sakId)) {
      return res(ctx.delay(500), ctx.status(200))
    }
    if (await barnebrillesakStore.tildel(sakId)) {
      return res(ctx.delay(500), ctx.status(200))
    }
    return res(ctx.delay(500), ctx.status(404))
  }),
  rest.delete<any, { sakId: string }, any>(`/api/tildeling/:sakId`, async (req, res, ctx) => {
    const { sakId } = req.params
    if (await sakStore.frigi(sakId)) {
      return res(ctx.status(200))
    }
    if (await barnebrillesakStore.frigi(sakId)) {
      return res(ctx.status(200))
    }
    return res(ctx.status(404))
  }),
  rest.get<any, { sakId: string }, any>(`/api/sak/:sakId`, async (req, res, ctx) => {
    const { sakId } = req.params
    if (sakId === '666') {
      return res(ctx.status(403), ctx.text('Du har ikke tilgang til saker tilhørende andre hjelpemiddelsentraler.'))
    }
    if (sakId === '999') {
      return res(ctx.status(401), ctx.text('Unauthorized.'))
    }
    if (sakId === '500') {
      return res(ctx.status(500), ctx.text('Teknisk feil'))
    }
    const sak = await sakStore.hent(sakId)

    if (sak) {
      return res(
        //ctx.delay(200),
        ctx.status(200),
        ctx.json({ kanTildeles: sak.status === OppgaveStatusType.AVVENTER_SAKSBEHANDLER, data: sak })
      )
    }
    const barnebrillesak = await barnebrillesakStore.hent(sakId)
    if (barnebrillesak) {
      return res(
        //ctx.delay(200),
        ctx.status(200),
        ctx.json({
          kanTildeles:
            barnebrillesak.status === OppgaveStatusType.AVVENTER_SAKSBEHANDLER ||
            barnebrillesak.status === OppgaveStatusType.AVVENTER_GODKJENNER,
          data: barnebrillesak,
        })
      )
    }
    return res(/*ctx.delay(200),*/ ctx.status(404))
  }),
  rest.get<any, { sakId: string }, any>(`/api/sak/:sakId/historikk`, async (req, res, ctx) => {
    const { sakId } = req.params
    const hendelser = await Promise.all([sakStore.hentHendelser(sakId), barnebrillesakStore.hentHendelser(sakId)])
    return res(/*ctx.delay(200),*/ ctx.status(200), ctx.json(hendelser.flat()))
  }),
  rest.get<any, { sakId: string }, any>(`/api/sak/:sakId/dokumenter`, async (req, res, ctx) => {
    const { sakId } = req.params
    const dokumentType = req.url.searchParams.get('type')

    // Hvis ingen type er angitt som query param, bruker gammel oppførsel som henter journalposter fra sak.
    // Ligger her for å bevare bakoverkompabilitet
    // På sikt skal vi vekk fra dette og heller hente innkommende journalposter fra sak hentet fra joark.
    if (!dokumentType) {
      const sak = await barnebrillesakStore.hent(sakId)

      if (!sak) {
        return res(ctx.status(404))
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

      return res(ctx.status(200), ctx.json(dokumenter.flat()))
    } else {
      const saksdokumenter = await barnebrillesakStore.hentSaksdokumenter(sakId /*, dokumentType*/)
      return res(ctx.status(200), ctx.json(saksdokumenter))
    }
  }),
  rest.put<VedtakPayload, { sakId: string }, any>('/api/vedtak-v2/:sakId', async (req, res, ctx) => {
    const sakId = req.params.sakId
    const status = req.body.status

    sakStore.fattVedtak(sakId, OppgaveStatusType.VEDTAK_FATTET, status)
    return res(/*ctx.delay(500),*/ ctx.status(200), ctx.json({}))
  }),
  rest.put<{ søknadsbeskrivelse: any }, { sakId: string }, any>('/api/tilbakefoer/:sakId', async (req, res, ctx) => {
    const sakId = req.params.sakId
    sakStore.oppdaterStatus(sakId, OppgaveStatusType.SENDT_GOSYS)
    return res(/*ctx.delay(500),*/ ctx.status(200), ctx.json({}))
  }),
  rest.put<{ status: OppgaveStatusType }, { sakId: string }, any>('/api/sak/:sakId/status', async (req, res, ctx) => {
    const sakId = req.params.sakId
    const status = req.body.status
    barnebrillesakStore.oppdaterStatus(sakId, status)
    barnebrillesakStore.lagreHendelse(sakId, 'Fortsetter behandling av sak')
    return res(/*ctx.delay(300),*/ ctx.status(200))
  }),
  rest.put<{ tilbakemelding: any; begrunnelse: any }, { sakId: string }>(
    '/api/bestilling/avvis/:sakId',
    async (req, res, ctx) => {
      sakStore.oppdaterStatus(req.params.sakId, OppgaveStatusType.AVVIST)
      return res(/*ctx.delay(500),*/ ctx.status(200), ctx.json({}))
    }
  ),
  rest.get(`/api/oppgaver`, async (req, res, ctx) => {
    const statusFilter = req.url.searchParams.get('status')
    const sakerFilter = req.url.searchParams.get('saksbehandler')
    const områdeFilter = req.url.searchParams.get('område')
    const sakstypeFilter = req.url.searchParams.get('type')
    const currentPage = Number(req.url.searchParams.get('page'))
    const pageSize = Number(req.url.searchParams.get('limit'))

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

    return res(/*ctx.delay(200),*/ ctx.status(200), ctx.json(response))
  }),
  rest.put<any, { sakId: string }, any>('/api/bestilling/ferdigstill/:sakId', (req, res, ctx) => {
    sakStore.oppdaterStatus(req.params.sakId, OppgaveStatusType.FERDIGSTILT)
    return res(/*ctx.delay(500),*/ ctx.status(200), ctx.json({}))
  }),
  rest.put<EndreHjelpemiddelRequest, { sakId: string }, any>('/api/bestilling/v2/:sakId', async (req, res, ctx) => {
    await req.json<EndreHjelpemiddelRequest>()
    return res(ctx.status(200), ctx.json({}))
  }),
  rest.post<any, { sakId: string }, any>('/api/sak/:sakId/vilkarsvurdering', async (req, res, ctx) => {
    await barnebrillesakStore.oppdaterSteg(req.params.sakId, StegType.FATTE_VEDTAK)
    return res(/*ctx.delay(1000),*/ ctx.status(200), ctx.json({}))
  }),
  rest.post<any, { sakId: string }, any>('/api/sak/:sakId/brevsending', async (req, res, ctx) => {
    await barnebrillesakStore.lagreSaksdokument(req.params.sakId, 'Innhent opplysninger')
    await barnebrillesakStore.oppdaterStatus(req.params.sakId, OppgaveStatusType.AVVENTER_DOKUMENTASJON)
    await barnebrillesakStore.fjernBrevtekst(req.params.sakId)
    return res(/*ctx.delay(3000),*/ ctx.status(200), ctx.json({}))
  }),
]
