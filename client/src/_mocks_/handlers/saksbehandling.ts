import { rest } from 'msw'

import historikk from '../mockdata/historikk.json'
import oppgaveliste from '../mockdata/oppgaveliste.json'
import saker from '../mockdata/saker.json'

const sakshistorikk = [
  { saksid: '111111', hendelser: deepClone(historikk) },
  { saksid: '222222', hendelser: deepClone(historikk) },
  { saksid: '5878444', hendelser: deepClone(historikk) },
  { saksid: '1234567', hendelser: deepClone(historikk) },
  { saksid: '999999', hendelser: deepClone(historikk) },
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
    // @ts-ignore
    saker[sakIdx]['saksbehandler'] = saksbehandler
    saker[sakIdx]['status'] = 'TILDELT_SAKSBEHANDLER'
    oppgaveliste[oppgaveIdx]['saksbehandler'] = saksbehandler
    oppgaveliste[oppgaveIdx]['status'] = 'TILDELT_SAKSBEHANDLER'

    return res(ctx.status(201), ctx.json({}))
  }),
  rest.get(`/api/sak/:saksid`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(saker.filter((sak) => sak.saksid === req.params.saksid)[0] || saker[2]))
  }),
  rest.get(`/api/sak/:saksid/historikk`, (req, res, ctx) => {
    const hist = sakshistorikk.filter((it) => it.saksid === req.params.saksid).map((it) => it.hendelser)[0]
    return res(ctx.status(200), ctx.json(hist))
  }),
  rest.put('/api/vedtak/:saksnummer', (req, res, ctx) => {
    //@ts-ignore
    const soknadsbeskrivelse = req.body.søknadsbeskrivelse
    const sakIdx = saker.findIndex((sak) => sak.saksid === req.params.saksnummer)
    const oppgaveIdx = oppgaveliste.findIndex((oppgave) => oppgave.saksid === req.params.saksnummer)

    const historikkIdx = sakshistorikk.findIndex((it) => it.saksid === req.params.saksnummer)

    const dokumentBeskrivelseHendelse = {
      id: '3',
      hendelse: 'Dokumentbeskrivelse oppdatert',
      detaljer: soknadsbeskrivelse,
      opprettet: '2021-03-29T12:43:44',
      bruker: 'Silje Saksbehandler',
    }
    const vedtakHendelse = {
      id: '4',
      hendelse: 'Vedtak fattet',
      opprettet: '2021-03-29T12:43:45',
      detaljer: 'Søknaden blir innvilget',
      bruker: 'Silje Saksbehandler',
    }
    const sfHendelse = {
      id: '5',
      tittel: 'Serviceforespørsel opprettet i OEBS',
      timestamp: '2021-03-29T12:45:45',
      innhold: 'SF-nummer: 1390009031',
    }

    sakshistorikk[historikkIdx]['hendelser'].push(dokumentBeskrivelseHendelse)
    sakshistorikk[historikkIdx]['hendelser'].push(vedtakHendelse)
    sakshistorikk[historikkIdx]['hendelser'].push(sfHendelse)

    oppgaveliste[oppgaveIdx]['status'] = 'VEDTAK_FATTET'
    oppgaveliste[oppgaveIdx]['søknadOm'] = soknadsbeskrivelse

    saker[sakIdx]['søknadGjelder'] = soknadsbeskrivelse
    saker[sakIdx]['status'] = 'VEDTAK_FATTET'
    // @ts-ignore
    saker[sakIdx]['vedtak'] = {
      vedtaksDato: '2021-03-29',
      status: 'INNVILGET',
      saksbehandlerRef: '23ea7485-1324-4b25-a763-assdfdfa',
      saksbehandlerNavn: 'Silje Saksbehandler',
      soknadUuid: '06d4f1b0-a7b0-4568-a899-c1321164e95a',
    }

    return res(ctx.status(200), ctx.json({}))
  }),
  rest.put('/api/tilbakefoer/:saksnummer', (req, res, ctx) => {
    //@ts-ignore
    const soknadsbeskrivelse = req.body.søknadsbeskrivelse
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

    saker[sakIdx]['søknadGjelder'] = soknadsbeskrivelse
    saker[oppgaveIdx]['status'] = 'SENDT_GOSYS'

    return res(ctx.status(200), ctx.json({}))
  }),
  rest.get(`/api/oppgaver/`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(oppgaveliste))
  }),
]

export default saksbehandlingHandlers
