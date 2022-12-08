import { rest } from 'msw'

import { DokumentOppgave } from '../../types/types.internal'
import dokumentliste from '../mockdata/dokumentliste.json'

const dokumentHandlers = [
  // dokumenter for saksbehandlers enhet hvor status != endelig journalført
  rest.get(`/api/dokumenter`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(dokumentliste))
  }),
  rest.get(`/api/dokumenter/:journalpostID`, (req, res, ctx) => {
    const journalpost = dokumentliste.filter((dokument) => dokument.journalpostID === req.params.journalpostID)

    if (journalpost.length === 1) {
      return res(ctx.status(200), ctx.json(journalpost[0]))
    } else {
      return res(ctx.status(404))
    }
  }),
  rest.post(`/api/dokumenter/:journalpostID/tildeling`, (req, res, ctx) => {
    return res(ctx.status(200))
    // setter innlogget bruker som saksbehandler på "oppgaven" på samme måte som for sak
  }),
  // Henter ARKIV variant av et gitt dokument fra SAF via hm-saksbehandling-api
  // /api/journalpost/:journalpostid/:dokumentid/
]

export default dokumentHandlers
