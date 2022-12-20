import { rest } from 'msw'

import kvittering from '../mockdata/brillekvittering.pdf'
import brilleseddel from '../mockdata/brilleseddel.pdf'
//import { Journalpost } from '../../types/types.internal'
import dokumentliste from '../mockdata/dokumentliste.json'
import kvitteringsside from '../mockdata/kvitteringsside.pdf'
import pdfSoknad from '../mockdata/manuellBrilleSoknad.pdf'

const dokumentHandlers = [
  // dokumenter for saksbehandlers enhet hvor status != endelig journalført
  rest.get(`/api/journalposter`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(dokumentliste))
  }),
  rest.get(`/api/journalpost/:journalpostID`, (req, res, ctx) => {
    const journalpost = dokumentliste.filter((dokument) => dokument.journalpostID === req.params.journalpostID)

    if (journalpost.length === 1) {
      return res(ctx.status(200), ctx.json(journalpost[0]))
    } else {
      return res(ctx.status(404))
    }
  }),
  rest.post(`/api/journalpost/:journalpostID/tildeling`, (req, res, ctx) => {
    return res(ctx.status(200))
    // setter innlogget bruker som saksbehandler på "oppgaven" på samme måte som for sak
  }),
  rest.get(`/api/journalpost/:journalpostID/:dokumentID`, async (req, res, ctx) => {
    const dokumentID = req.params.dokumentID

    let dokument

    switch (dokumentID) {
      case '2345':
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
      ctx.set('Content-Length', buffer.byteLength.toString()),
      ctx.set('Content-Type', 'application/pdf'),
      ctx.body(buffer)
    )
  }),
  // Henter ARKIV variant av et gitt dokument fra SAF via hm-saksbehandling-api
  // /api/journalpost/:journalpostid/:dokumentid/
]

export default dokumentHandlers
