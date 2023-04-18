import { rest } from 'msw'

import { TotrinnsKontrollData, TotrinnsKontrollVurdering } from '../../types/types.internal'
import {
  mutableOppgaveliste as oppgaveliste,
  mutableSaker as saker,
  mutableSakshistorikk as sakshistorikk,
} from './modell'

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
    saker[sakIdx]['status'] = 'AVVENTER_GODKJENNER'
    saker[sakIdx]['totrinnskontroll'] = totrinnkontroll
    oppgaveliste[oppgaveIdx]['saksbehandler'] = null
    oppgaveliste[oppgaveIdx]['status'] = 'AVVENTER_GODKJENNER'

    return res(ctx.delay(500), ctx.status(201), ctx.json({}))
  }),
  rest.put<TotrinnsKontrollData, any, any>(`/api/sak/:saksnummer/kontroll`, async (req, res, ctx) => {
    const sakIdx = saker.findIndex((sak) => sak.saksid === req.params.saksnummer)
    const oppgaveIdx = oppgaveliste.findIndex((oppgave) => oppgave.saksid === req.params.saksnummer)

    const historikkIdx = sakshistorikk.findIndex((it) => it.saksid === req.params.saksnummer)

    const body = await req.json()
    const vurdering: TotrinnsKontrollVurdering | '' = body.resultat
    const begrunnelse = body.begrunnelse

    if (vurdering === TotrinnsKontrollVurdering.RETURNERT) {
      saker[sakIdx]['saksbehandler'] = {
        epost: 'silje.saksbehandler@nav.no',
        objectId: '3fd4105e-09b8-4d9d-b61c-8ad46c63f819',
        navn: 'Silje Saksbehandler',
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      saker[sakIdx]['totrinnskontroll']['resultat'] = 'RETURNERT'
      saker[sakIdx]['status'] = 'TILDELT_SAKSBEHANDLER'
      saker[sakIdx]['steg'] = 'GODKJENNE'
      oppgaveliste[oppgaveIdx]['status'] = 'RETURNERT'
    } else if (vurdering === TotrinnsKontrollVurdering.GODKJENT) {
      saker[sakIdx]['saksbehandler'] = {
        epost: 'silje.saksbehandler@nav.no',
        objectId: '23ea7485-1324-4b25-a763-assdfdfa',
        navn: 'Silje Saksbehandler',
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      saker[sakIdx]['totrinnskontroll']['resultat'] = 'GODKJENT'
      saker[sakIdx]['status'] = 'VEDTAK_FATTET'
      ;(saker[sakIdx]['vedtak'] = {
        vedtaksdato: '2021-03-29',
        status: 'INNVILGET',
        saksbehandlerRef: '23ea7485-1324-4b25-a763-assdfdfa',
        saksbehandlerNavn: 'Silje Saksbehandler',
        soknadUuid: '06d4f1b0-a7b0-4568-a899-c1321164e95a',
      }),
        (saker[sakIdx]['steg'] = 'FERDIG_BEHANDLET')
      oppgaveliste[oppgaveIdx]['status'] = 'GODKJENT'
    }

    /*const hendelse = {
      id: '2',
      hendelse: 'Sendt til godkjenning: Innvilgelse',
      opprettet: '2023-02-27T13:37:45',
      bruker: 'Silje Saksbehandler',
    }*/

    //sakshistorikk[historikkIdx]['hendelser'].push(hendelse)
    //saker[sakIdx]['saksbehandler'] = undefined
    //saker[sakIdx]['status'] = 'AVVENTER_GODKJENNER'
    //saker[sakIdx]['totrinnskontroll'] = totrinnkontroll
    oppgaveliste[oppgaveIdx]['saksbehandler'] = {
      epost: 'silje.saksbehandler@nav.no',
      objectId: '23ea7485-1324-4b25-a763-assdfdfa',
      navn: 'Silje Saksbehandler',
    }
    oppgaveliste[oppgaveIdx]['status'] = ''

    return res(ctx.delay(500), ctx.status(201), ctx.json({}))
  }),
]

export default totrinnsKontrollHandlers
