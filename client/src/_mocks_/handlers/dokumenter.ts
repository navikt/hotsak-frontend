import { rest } from 'msw'

import { DokumentOppgaveStatusType, JournalføringRequest, OpprettetSakResponse } from '../../types/types.internal'
import kvittering from '../mockdata/brillekvittering.pdf'
import brilleseddel from '../mockdata/brilleseddel.pdf'
//import { Journalpost } from '../../types/types.internal'
import dokumentliste from '../mockdata/dokumentliste.json'
import { journalposterByJournalpostId } from '../mockdata/journalposter'
import kvitteringsside from '../mockdata/kvitteringsside.pdf'
import pdfSoknad from '../mockdata/manuellBrilleSoknad.pdf'

const dokumentHandlers = [
  // dokumenter for saksbehandlers enhet hvor status != endelig journalført
  rest.get(`/api/journalposter`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(dokumentliste))
  }),
  rest.get(`/api/journalpost/:journalpostID`, (req, res, ctx) => {
    const journalpostID = req.params.journalpostID as string

    const journalpost = journalposterByJournalpostId[journalpostID]
    if (journalpost) {
      return res(ctx.delay(200), ctx.status(200), ctx.json(journalpost))
    }

    const journalposter = dokumentliste.filter((dokument) => dokument.journalpostID === req.params.journalpostID)
    if (journalposter.length === 1) {
      return res(ctx.status(200), ctx.json(journalposter[0]))
    } else {
      return res(ctx.status(404))
    }
  }),

  rest.get(`/api/journalpost/:journalpostID/:dokumentID`, async (req, res, ctx) => {
    const dokumentID = req.params.dokumentID

    let dokument

    switch (dokumentID) {
      case '2345':
        //return res(ctx.delay(500), ctx.status(500), ctx.text('Dokumentet finnes ikke'))
        dokument = kvittering
        break
      case '3456':
        dokument = brilleseddel
        break
      case '4567':
        dokument = kvitteringsside
        break
      case '1234':
      default:
        dokument = pdfSoknad
        break
    }

    const buffer = await fetch(dokument).then((res) => res.arrayBuffer())
    return res(
      ctx.delay(500),
      ctx.set('Content-Length', buffer.byteLength.toString()),
      ctx.set('Content-Type', 'application/pdf'),
      ctx.body(buffer)
    )
  }),
  rest.post<JournalføringRequest, any, OpprettetSakResponse>(
    `/api/journalpost/:journalpostID/journalforing`,
    async (req, res, ctx) => {
      const journalpost: JournalføringRequest = await req.json()
      const journalpostIdx = dokumentliste.findIndex((dokument) => dokument.journalpostID === journalpost.journalpostID)
      dokumentliste[journalpostIdx]['status'] = DokumentOppgaveStatusType.JOURNALFØRT

      return res(ctx.delay(500), ctx.status(200), ctx.json({ sakId: '9876' }))
    }
  ),
  rest.post(`/api/journalpost/:journalpostID/tildeling`, (req, res, ctx) => {
    const journalpostIdx = dokumentliste.findIndex((dokument) => dokument.journalpostID === req.params.journalpostID)

    const saksbehandler = {
      epost: 'silje.saksbehandler@nav.no',
      objectId: '23ea7485-1324-4b25-a763-assdfdfa',
      navn: 'Silje Saksbehandler',
    }

    dokumentliste[journalpostIdx]['saksbehandler'] = saksbehandler
    dokumentliste[journalpostIdx]['status'] = DokumentOppgaveStatusType.TILDELT_SAKSBEHANDLER

    return res(ctx.delay(500), ctx.status(200), ctx.json({}))
  }),
  rest.post('/api/journalpost/:journalpostID/tilbakeforing', (req, res, ctx) => {
    return res(ctx.delay(500), ctx.status(204))
  }),
]

export default dokumentHandlers
