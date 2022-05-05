import { rest } from 'msw'

import bestillinger from '../mockdata/bestillinger.json'
import historikk from '../mockdata/historikk.json'
import oppgaveliste from '../mockdata/oppgaveliste.json'

const bestillingshistorikk = [
  { saksid: '112233', hendelser: deepClone(historikk) },
  { saksid: '223344', hendelser: deepClone(historikk) },
]

function deepClone(array: any[]) {
  return JSON.parse(JSON.stringify(array))
}

const bestillingsordningsHandlers = [
  rest.get(`/api/bestilling/:saksid`, (req, res, ctx) => {
    //@ts-ignore
    return res(
      ctx.status(200),
      ctx.json(bestillinger.filter((bestilling) => bestilling.id === req.params.saksid)[0] || bestillinger[1])
    )
  }),
  rest.get(`/api/bestilling/:saksid/historikk`, (req, res, ctx) => {
    const hist = bestillingshistorikk.filter((it) => it.saksid === req.params.saksid).map((it) => it.hendelser)[0]
    return res(ctx.status(200), ctx.json(hist))
  }),
  rest.post(`/api/bestilling/tildeling/:saksnummer`, (req, res, ctx) => {
    //@ts-ignore
    const sakIdx = bestillinger.findIndex((bestilling) => bestilling.id === req.params.saksnummer)
    const oppgaveIdx = oppgaveliste.findIndex((oppgave) => oppgave.saksid === req.params.saksnummer)

    const saksbehandler = {
      epost: 'silje.saksbehandler@nav.no',
      objectId: '23ea7485-1324-4b25-a763-assdfdfa',
      navn: 'Silje Saksbehandler',
    }

    const historikkIdx = bestillingshistorikk.findIndex((it) => it.saksid === req.params.saksnummer)

    const hendelse = {
      id: '2',
      hendelse: 'Saksbehandler har tatt saken',
      opprettet: '2021-03-29T12:38:45',
      bruker: 'Silje Saksbehandler',
    }

    bestillingshistorikk[historikkIdx]['hendelser'].push(hendelse)
    // @ts-ignore
    bestillinger[sakIdx]['saksbehandler'] = saksbehandler
    bestillinger[sakIdx]['status'] = 'TILDELT_SAKSBEHANDLER'
    oppgaveliste[oppgaveIdx]['saksbehandler'] = saksbehandler
    oppgaveliste[oppgaveIdx]['status'] = 'TILDELT_SAKSBEHANDLER'

    return res(ctx.status(201), ctx.json({}))
  }),
  rest.put('/api/bestilling/ferdigstill/:saksnummer', (req, res, ctx) => {
    console.log('Ferdigstiller')

    //@ts-ignore
    const bestillingIdx = bestillinger.findIndex((bestilling) => bestilling.id === req.params.saksnummer)
    const oppgaveIdx = oppgaveliste.findIndex((oppgave) => oppgave.saksid === req.params.saksnummer)

    const historikkIdx = bestillingshistorikk.findIndex((it) => it.saksid === req.params.saksnummer)

    const vedtakHendelse = {
      id: '4',
      hendelse: 'Bestilling ferdigstilt',
      opprettet: '2022-05-05T12:43:45',
      bruker: 'Silje Saksbehandler',
    }
    const sfHendelse = {
      id: '5',
      hendelse: 'Ordre opprettett i ordreorganisator i OEBS',
      opprettet: '2022-05-05T12:44:00.815302',
      detaljer: 'Ordrenummer: 1390009031',
    }

    bestillingshistorikk[historikkIdx]['hendelser'].push(vedtakHendelse)
    bestillingshistorikk[historikkIdx]['hendelser'].push(sfHendelse)

    oppgaveliste[oppgaveIdx]['status'] = 'FERDIGSTILT'

    bestillinger[bestillingIdx]['status'] = 'FERDIGSTILT'
    //@ts-ignore
    bestillinger[bestillingIdx]['statusEndretDato'] = '2021-10-05T21:52:40.815302'

    return res(ctx.status(200), ctx.json({}))
  }),
]

export default bestillingsordningsHandlers
