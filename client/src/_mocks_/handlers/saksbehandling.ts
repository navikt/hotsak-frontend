import { rest } from 'msw'

import { EndreHjelpemiddelRequest, OppgaveStatusType, SakerFilter } from '../../types/types.internal'
import historikk from '../mockdata/historikk.json'
import oppgaveliste from '../mockdata/oppgaveliste.json'
import saker from '../mockdata/saker.json'

const sakshistorikk = [
  { saksid: '111111', hendelser: deepClone(historikk) },
  { saksid: '222222', hendelser: deepClone(historikk) },
  { saksid: '5878444', hendelser: deepClone(historikk) },
  { saksid: '1234567', hendelser: deepClone(historikk) },
  { saksid: '888888', hendelser: deepClone(historikk) },
  { saksid: '999999', hendelser: deepClone(historikk) },
  { saksid: '112233', hendelser: deepClone(historikk) },
  { saksid: '223344', hendelser: deepClone(historikk) },
]

function deepClone(array: any[]) {
  return JSON.parse(JSON.stringify(array))
}

const saksbehandlingHandlers = [
  rest.post(`/api/tildeling/:saksnummer`, (req, res, ctx) => {
    const sakIdx = saker.findIndex((sak) => sak.saksid === req.params.saksnummer)
    const oppgaveIdx = oppgaveliste.findIndex((oppgave) => oppgave.saksid === req.params.saksnummer)

    const saksbehandler = {
      epost: 'silje.saksbehandler@nav.no',
      objectId: '23ea7485-1324-4b25-a763-assdfdfa',
      navn: 'Silje Saksbehandler',
    }

    const historikkIdx = sakshistorikk.findIndex((it) => it.saksid === req.params.saksnummer)

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

    return res(ctx.delay(500), ctx.status(201), ctx.json({}))
  }),
  rest.delete(`/api/tildeling/:oppgaveref`, (req, res, ctx) => {
    const sakIdx = saker.findIndex((sak) => sak.saksid === req.params.oppgaveref)
    const oppgaveIdx = oppgaveliste.findIndex((oppgave) => oppgave.saksid === req.params.oppgaveref)

    const historikkIdx = sakshistorikk.findIndex((it) => it.saksid === req.params.oppgaveref)

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

    return res(ctx.status(201), ctx.json({}))
  }),
  rest.get(`/api/sak/:saksid`, (req, res, ctx) => {
    if (req.params.saksid === '666') {
      return res(ctx.status(403), ctx.text('Du har ikke tilgang til saker tilhørende andre hjelpemiddelsentraler.'))
    }
    if (req.params.saksid === '999') {
      return res(ctx.status(401), ctx.text('Unauthorized.'))
    }

    return res(ctx.status(200), ctx.json(saker.filter((sak) => sak.saksid === req.params.saksid)[0] || saker[2]))
  }),
  rest.get(`/api/sak/:saksid/historikk`, (req, res, ctx) => {
    const hist = sakshistorikk.filter((it) => it.saksid === req.params.saksid).map((it) => it.hendelser)[0]
    return res(ctx.status(200), ctx.json(hist))
  }),
  rest.put<{ søknadsbeskrivelse: any }>('/api/vedtak-v2/:saksnummer', (req, res, ctx) => {
    const soknadsbeskrivelse = req?.body?.søknadsbeskrivelse
    const sakIdx = saker.findIndex((sak) => sak.saksid === req.params.saksnummer)
    const oppgaveIdx = oppgaveliste.findIndex((oppgave) => oppgave.saksid === req.params.saksnummer)

    const historikkIdx = sakshistorikk.findIndex((it) => it.saksid === req.params.saksnummer)

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
    oppgaveliste[oppgaveIdx]['søknadOm'] = soknadsbeskrivelse

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
  rest.put<{ søknadsbeskrivelse: any }>('/api/tilbakefoer/:saksnummer', (req, res, ctx) => {
    const soknadsbeskrivelse = req?.body?.søknadsbeskrivelse
    const sakIdx = saker.findIndex((sak) => sak.saksid === req.params.saksnummer)
    const oppgaveIdx = oppgaveliste.findIndex((oppgave) => oppgave.saksid === req.params.saksnummer)

    const historikkIdx = sakshistorikk.findIndex((it) => it.saksid === req.params.saksnummer)
    const hendelse = {
      id: '5',
      hendelse: 'Saken ble overført Gosys',
      opprettet: '2021-03-29T12:43:45',
      bruker: 'Silje Saksbehandler',
    }

    sakshistorikk[historikkIdx]['hendelser'].push(hendelse)

    oppgaveliste[oppgaveIdx]['status'] = 'SENDT_GOSYS'
    oppgaveliste[oppgaveIdx]['søknadOm'] = soknadsbeskrivelse

    saker[sakIdx]['status'] = 'SENDT_GOSYS'
    saker[sakIdx]['statusEndret'] = '2021-10-05T21:52:40.815302'

    return res(ctx.delay(500), ctx.status(200), ctx.json({}))
  }),
  rest.put<{ tilbakemelding: any; begrunnelse: any }>('/api/bestilling/avvis/:saksnummer', (req, res, ctx) => {
    const årsaker = `${req?.body?.tilbakemelding?.valgtArsak}`
    const begrunnelse =
      req?.body?.tilbakemelding?.begrunnelse && req?.body?.tilbakemelding?.begrunnelse !== ''
        ? `${req?.body?.tilbakemelding?.begrunnelse}`
        : ''

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
  rest.get(`/api/oppgaver`, (req, res, ctx) => {
    const statusFilter = req.url.searchParams.get('status')
    const sakerFilter = req.url.searchParams.get('saksbehandler')
    const områdeFilter = req.url.searchParams.get('område')
    const sakstypeFilter = req.url.searchParams.get('type')
    const currentPage = Number(req.url.searchParams.get('page'))
    const pageSize = Number(req.url.searchParams.get('limit'))

    const startIndex = currentPage - 1
    const endIndex = startIndex + pageSize
    const filtrerteOppgaver = oppgaveliste
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
        områdeFilter ? oppgave.personinformasjon.funksjonsnedsettelse.includes(områdeFilter.toLowerCase()) : true
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

    return res(ctx.status(200), ctx.json(response))
  }),
  rest.put('/api/bestilling/ferdigstill/:saksnummer', (req, res, ctx) => {
    const bestillingIdx = saker.findIndex((sak) => sak.saksid === req.params.saksnummer)
    const oppgaveIdx = oppgaveliste.findIndex((oppgave) => oppgave.saksid === req.params.saksnummer)

    const historikkIdx = sakshistorikk.findIndex((it) => it.saksid === req.params.saksnummer)

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
  rest.put<EndreHjelpemiddelRequest, any, any>('/api/bestilling/:saksnummer', (req, res, ctx) => {
    const bestillingIdx = saker.findIndex((sak) => sak.saksid === req.params.saksnummer)
    const historikkIdx = sakshistorikk.findIndex((it) => it.saksid === req.params.saksnummer)

    const {
      hmsNr: hmsNr,
      hmsBeskrivelse: hmsBeskrivelse,
      endretHmsNr: endretHmsNr,
      endretHmsBeskrivelse: endretHmsBeskrivelse,
      begrunnelse: endretBegrunnelse,
      begrunnelseFritekst: endretBegrunnelseFritekst,
    } = req.body
    const hjelpemiddelIdx = saker[bestillingIdx]['hjelpemidler'].findIndex((hjm) => hjm.hmsnr === hmsNr)

    const hjm = saker[bestillingIdx]['hjelpemidler'][hjelpemiddelIdx]

    if (hmsNr === endretHmsNr) {
      saker[bestillingIdx]['hjelpemidler'][hjelpemiddelIdx] = {
        ...hjm,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        endretHjelpemiddel: undefined,
      }
    } else {
      saker[bestillingIdx]['hjelpemidler'][hjelpemiddelIdx] = {
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
]

export default saksbehandlingHandlers
