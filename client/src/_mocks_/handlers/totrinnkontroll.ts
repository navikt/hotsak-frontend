import { rest } from 'msw'

import { mutableSaker as saker } from './modell'
import { mutalbleOppgaveliste as oppgaveliste } from './modell'
import { mutableSakshistorikk as sakshistorikk } from './modell'

const totrinnsKontrollHandlers = [
  rest.post(`/api/sak/:saksnummer/kontroll`, (req, res, ctx) => {
    const sakIdx = saker.findIndex((sak) => sak.saksid === req.params.saksnummer)
    const oppgaveIdx = oppgaveliste.findIndex((oppgave) => oppgave.saksid === req.params.saksnummer)

    const historikkIdx = sakshistorikk.findIndex((it) => it.saksid === req.params.saksnummer)

    /*const hendelse = {
      id: '2',
      hendelse: 'Sendt til godkjenning: Innvilgelse',
      opprettet: '2023-02-27T13:37:45',
      bruker: 'Silje Saksbehandler',
    }*/

    const totrinnkontroll = {
      saksbehandler: {
        epost: 'silje.saksbehandler@nav.no',
        objectId: '23ea7485-1324-4b25-a763-assdfdfa',
        navn: 'Silje Saksbehandler',
      },
      opprettet: '2023-02-27T13:55:45Z',
    }

    //sakshistorikk[historikkIdx]['hendelser'].push(hendelse)
    saker[sakIdx]['saksbehandler'] = undefined
    saker[sakIdx]['status'] = 'AVVENTER_GODKJENNING'
    saker[sakIdx]['totrinnskontroll'] = totrinnkontroll
    oppgaveliste[oppgaveIdx]['saksbehandler'] = null
    oppgaveliste[oppgaveIdx]['status'] = 'AVVENTER_GODKJENNING'

    return res(ctx.delay(500), ctx.status(201), ctx.json({}))
  }),
]

export default totrinnsKontrollHandlers
