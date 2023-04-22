import { rest } from 'msw'

import { EndreHjelpemiddelRequest, OppgaveStatusType, SakerFilter, StegType } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import {
  mutableOppgaveliste as oppgaveliste,
  mutableSaker as saker,
  mutableSakshistorikk as sakshistorikk,
} from './modell'

export const saksbehandlingHandlers: StoreHandlersFactory = ({ saksbehandlerStore, barnebrillesakStore }) => [
  rest.post<any, { sakId: string }, any>(`/api/tildeling/:sakId`, async (req, res, ctx) => {
    const { sakId } = req.params
    const saksbehandler = await saksbehandlerStore.innloggetSaksbehandler()
    if (await barnebrillesakStore.tildel(sakId)) {
      return res(ctx.delay(500), ctx.status(200))
    }

    const sakIdx = saker.findIndex((sak) => sak.saksid === sakId)
    const oppgaveIdx = oppgaveliste.findIndex((oppgave) => oppgave.saksid === sakId)
    const historikkIdx = sakshistorikk.findIndex((it) => it.saksid === sakId)

    const hendelse = {
      id: '2',
      hendelse: 'Saksbehandler har tatt saken',
      opprettet: '2021-03-29T12:38:45',
      bruker: 'Silje Saksbehandler',
    }

    sakshistorikk[historikkIdx]['hendelser'].push(hendelse)
    saker[sakIdx]['saksbehandler'] = saksbehandler
    saker[sakIdx]['status'] = 'TILDELT_SAKSBEHANDLER'
    oppgaveliste[oppgaveIdx]['saksbehandler'] = saksbehandler
    oppgaveliste[oppgaveIdx]['status'] = 'TILDELT_SAKSBEHANDLER'

    return res(ctx.delay(500), ctx.status(200))
  }),
  rest.delete<any, { sakId: string }, any>(`/api/tildeling/:sakId`, async (req, res, ctx) => {
    const { sakId } = req.params
    if (await barnebrillesakStore.frigi(sakId)) {
      return res(ctx.status(200))
    }

    const sakIdx = saker.findIndex((sak) => sak.saksid === sakId)
    const oppgaveIdx = oppgaveliste.findIndex((oppgave) => oppgave.saksid === sakId)
    const historikkIdx = sakshistorikk.findIndex((it) => it.saksid === sakId)
    const hendelse = {
      id: '2',
      hendelse: 'Saksbehandler har fjernet tildeling av saken',
      opprettet: '2021-03-29T12:38:45',
      bruker: 'Silje Saksbehandler',
    }

    sakshistorikk[historikkIdx]['hendelser'].push(hendelse)
    saker[sakIdx]['saksbehandler'] = undefined
    saker[sakIdx]['status'] = 'AVVENTER_SAKSBEHANDLER'
    oppgaveliste[oppgaveIdx]['saksbehandler'] = null
    oppgaveliste[oppgaveIdx]['status'] = 'AVVENTER_SAKSBEHANDLER'

    return res(ctx.status(200))
  }),
  rest.get(`/api/sak/:sakId`, async (req, res, ctx) => {
    const sakId = req.params.sakId as string
    if (sakId === '666') {
      return res(ctx.status(403), ctx.text('Du har ikke tilgang til saker tilhørende andre hjelpemiddelsentraler.'))
    }
    if (sakId === '999') {
      return res(ctx.status(401), ctx.text('Unauthorized.'))
    }
    const barnebrillesak = await barnebrillesakStore.hent(sakId)
    if (barnebrillesak) {
      return res(ctx.delay(200), ctx.status(200), ctx.json(barnebrillesak))
    }
    return res(ctx.delay(200), ctx.status(200), ctx.json(saker.filter((sak) => sak.sakId === sakId)[0] || saker[2]))
  }),
  rest.get<any, { sakId: string }, any>(`/api/sak/:sakId/historikk`, (req, res, ctx) => {
    const historikk = sakshistorikk.filter((it) => it.saksid === req.params.sakId).map((it) => it.hendelser)[0]
    return res(ctx.status(200), ctx.json(historikk))
  }),
  rest.put<{ søknadsbeskrivelse: any }, { sakId: string }, any>('/api/vedtak-v2/:sakId', async (req, res, ctx) => {
    const { søknadsbeskrivelse: soknadsbeskrivelse } = await req.json()
    const { sakId } = req.params
    const sakIdx = saker.findIndex((sak) => sak.saksid === sakId)
    const oppgaveIdx = oppgaveliste.findIndex((oppgave) => oppgave.saksid === sakId)

    const historikkIdx = sakshistorikk.findIndex((it) => it.saksid === sakId)

    const vedtakHendelse = {
      id: '4',
      hendelse: 'Vedtak fattet',
      opprettet: '2021-03-29T12:43:45',
      detaljer: 'Søknaden ble innvilget',
      bruker: 'Silje Saksbehandler',
    }
    const sfHendelse = {
      id: '5',
      hendelse: 'Serviceforespørsel opprettet i OEBS',
      opprettet: '2021-10-05T21:52:40.815302',
      detaljer: 'SF-nummer: 1390009031',
    }

    sakshistorikk[historikkIdx]['hendelser'].push(vedtakHendelse)
    sakshistorikk[historikkIdx]['hendelser'].push(sfHendelse)

    oppgaveliste[oppgaveIdx]['status'] = 'VEDTAK_FATTET'
    oppgaveliste[oppgaveIdx]['beskrivelse'] = soknadsbeskrivelse

    saker[sakIdx]['søknadGjelder'] = soknadsbeskrivelse
    saker[sakIdx]['status'] = 'VEDTAK_FATTET'
    saker[sakIdx]['vedtak'] = {
      vedtaksdato: '2021-03-29',
      status: 'INNVILGET',
      saksbehandlerRef: '23ea7485-1324-4b25-a763-assdfdfa',
      saksbehandlerNavn: 'Silje Saksbehandler',
      soknadUuid: '06d4f1b0-a7b0-4568-a899-c1321164e95a',
    }

    return res(ctx.delay(500), ctx.status(200), ctx.json({}))
  }),
  rest.put<{ søknadsbeskrivelse: any }, { sakId: string }, any>('/api/tilbakefoer/:sakId', async (req, res, ctx) => {
    const { søknadsbeskrivelse: soknadsbeskrivelse } = await req.json()
    const { sakId } = req.params
    const sakIdx = saker.findIndex((sak) => sak.saksid === sakId)
    const oppgaveIdx = oppgaveliste.findIndex((oppgave) => oppgave.saksid === sakId)

    const historikkIdx = sakshistorikk.findIndex((it) => it.saksid === sakId)
    const hendelse = {
      id: '5',
      hendelse: 'Saken ble overført Gosys',
      opprettet: '2021-03-29T12:43:45',
      bruker: 'Silje Saksbehandler',
    }

    sakshistorikk[historikkIdx]['hendelser'].push(hendelse)

    oppgaveliste[oppgaveIdx]['status'] = 'SENDT_GOSYS'
    oppgaveliste[oppgaveIdx]['beskrivelse'] = soknadsbeskrivelse

    saker[sakIdx]['status'] = 'SENDT_GOSYS'
    saker[sakIdx]['statusEndret'] = '2021-10-05T21:52:40.815302'

    return res(ctx.delay(500), ctx.status(200), ctx.json({}))
  }),
  rest.put<{ tilbakemelding: any; begrunnelse: any }>('/api/bestilling/avvis/:saksnummer', async (req, res, ctx) => {
    const { tilbakemelding } = await req.json()
    const årsaker = `${tilbakemelding?.valgtArsak}`
    const begrunnelse =
      tilbakemelding?.begrunnelse && tilbakemelding?.begrunnelse !== '' ? `${tilbakemelding?.begrunnelse}` : ''

    const sakIdx = saker.findIndex((sak) => sak.saksid === req.params.saksnummer)
    const oppgaveIdx = oppgaveliste.findIndex((oppgave) => oppgave.saksid === req.params.saksnummer)

    const historikkIdx = sakshistorikk.findIndex((it) => it.saksid === req.params.saksnummer)
    const hendelse = {
      id: '5',
      hendelse: 'Bestillingen ble avvist',
      opprettet: '2021-03-29T12:43:45',
      bruker: 'Silje Saksbehandler',
      detaljer: `${årsaker};${begrunnelse}`,
    }

    sakshistorikk[historikkIdx]['hendelser'].push(hendelse)

    oppgaveliste[oppgaveIdx]['status'] = 'AVVIST'

    saker[sakIdx]['status'] = 'AVVIST'
    saker[sakIdx]['statusEndret'] = '2022-06-03T10:48:40.47986'

    return res(ctx.delay(500), ctx.status(200), ctx.json({}))
  }),
  rest.get(`/api/oppgaver`, async (req, res, ctx) => {
    const statusFilter = req.url.searchParams.get('status')
    const sakerFilter = req.url.searchParams.get('saksbehandler')
    const områdeFilter = req.url.searchParams.get('område')
    const sakstypeFilter = req.url.searchParams.get('type')
    const currentPage = Number(req.url.searchParams.get('page'))
    const pageSize = Number(req.url.searchParams.get('limit'))

    const startIndex = currentPage - 1
    const endIndex = startIndex + pageSize
    const filtrerteOppgaver = [...oppgaveliste, ...(await barnebrillesakStore.oppgaver())]
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

    const filterApplied = oppgaveliste.length !== filtrerteOppgaver.length

    const response = {
      oppgaver: !filterApplied
        ? oppgaveliste.slice(startIndex, endIndex)
        : filtrerteOppgaver.slice(startIndex, endIndex),
      totalCount: !filterApplied ? oppgaveliste.length : filtrerteOppgaver.length,
      pageSize: pageSize,
      currentPage: currentPage,
    }

    return res(ctx.delay(200), ctx.status(200), ctx.json(response))
  }),
  rest.put<any, { sakId: string }, any>('/api/bestilling/ferdigstill/:sakId', (req, res, ctx) => {
    const { sakId } = req.params
    const bestillingIdx = saker.findIndex((sak) => sak.saksid === sakId)
    const oppgaveIdx = oppgaveliste.findIndex((oppgave) => oppgave.saksid === sakId)

    const historikkIdx = sakshistorikk.findIndex((it) => it.saksid === sakId)

    const vedtakHendelse = {
      id: '4',
      hendelse: 'Bestilling godkjent i Hotsak',
      opprettet: '2022-05-05T12:43:45',
      bruker: 'Silje Saksbehandler',
    }
    const ordreRegistertHendelse = {
      id: '5',
      hendelse: 'Ordre oppdatert i OEBS',
      opprettet: '2022-05-05T12:48:00.815302',
      detaljer: 'Ordrenummer: 1390009031 | Status: Registrert',
    }
    const ordreFerdigstiltHendelse = {
      id: '6',
      hendelse: 'Ordre oppdatert i OEBS',
      opprettet: '2022-05-05T12:49:00.815302',
      detaljer: 'Ordrenummer: 1390009031 | Status: Klargjort',
    }

    sakshistorikk[historikkIdx]['hendelser'].push(vedtakHendelse)
    sakshistorikk[historikkIdx]['hendelser'].push(ordreRegistertHendelse)
    sakshistorikk[historikkIdx]['hendelser'].push(ordreFerdigstiltHendelse)

    oppgaveliste[oppgaveIdx]['status'] = 'FERDIGSTILT'

    saker[bestillingIdx]['status'] = 'FERDIGSTILT'
    saker[bestillingIdx]['statusEndret'] = '2021-10-05T21:52:40.815302'

    return res(ctx.delay(500), ctx.status(200), ctx.json({}))
  }),
  rest.put<EndreHjelpemiddelRequest, { sakId: string }, any>('/api/bestilling/v2/:sakId', async (req, res, ctx) => {
    const { sakId } = req.params
    const bestillingIdx = saker.findIndex((sak) => sak.saksid === sakId)
    const historikkIdx = sakshistorikk.findIndex((it) => it.saksid === sakId)

    const {
      hmsNr: hmsNr,
      hmsBeskrivelse: hmsBeskrivelse,
      endretHmsNr: endretHmsNr,
      endretHmsBeskrivelse: endretHmsBeskrivelse,
      begrunnelse: endretBegrunnelse,
      begrunnelseFritekst: endretBegrunnelseFritekst,
    } = await req.json<EndreHjelpemiddelRequest>()
    const hjelpemiddelIdx = saker[bestillingIdx]['hjelpemidler']!.findIndex((hjm) => hjm.hmsnr === hmsNr)
    const hjm = saker[bestillingIdx]['hjelpemidler']![hjelpemiddelIdx]

    if (hmsNr === endretHmsNr) {
      saker[bestillingIdx]['hjelpemidler']![hjelpemiddelIdx] = {
        ...hjm,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        endretHjelpemiddel: undefined,
      }
    } else {
      saker[bestillingIdx]['hjelpemidler']![hjelpemiddelIdx] = {
        ...hjm,
        endretHjelpemiddel: {
          hmsNr: endretHmsNr,
          begrunnelse: endretBegrunnelse,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          begrunnelseFritekst: endretBegrunnelseFritekst,
        },
      }
    }
    const endreHjmHendelse = {
      id: sakshistorikk[historikkIdx]['hendelser'].length + 1,
      hendelse: 'Endret artikkelnummer hjelpemiddel',
      detaljer: `Nytt: ${endretHmsNr} ${endretHmsBeskrivelse};Opprinnelig: ${hmsNr} ${hmsBeskrivelse};Begrunnelse: "${endretBegrunnelseFritekst}"`,
      opprettet: '2022-05-05T12:43:45',
      bruker: 'Silje Saksbehandler',
    }
    sakshistorikk[historikkIdx]['hendelser'].push(endreHjmHendelse)

    return res(ctx.status(200), ctx.json({}))
  }),
  rest.put<any, { sakId: string }, any>('/api/sak/:sakId/steg/fatte_vedtak', async (req, res, ctx) => {
    await barnebrillesakStore.oppdaterSteg(req.params.sakId, StegType.FATTE_VEDTAK)
    return res(ctx.delay(1000), ctx.status(200), ctx.json({}))
  }),
]
