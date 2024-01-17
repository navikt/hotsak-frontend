import { rest } from 'msw'

import { JournalføringRequest, OpprettetSakResponse } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import kvittering from '../data/brillekvittering.pdf'
import brilleseddel from '../data/brilleseddel.pdf'
import kvitteringsside from '../data/kvitteringsside.pdf'
import pdfSoknad from '../data/manuellBrilleSoknad.pdf'

export const dokumentHandlers: StoreHandlersFactory = ({ journalpostStore, barnebrillesakStore }) => [
  // dokumenter for saksbehandlers enhet hvor status != endelig journalført
  /*rest.get(`/api/oppgaver`, async (req, res, ctx) => {
    const journalposter = await journalpostStore.alle()
    return res(ctx.delay(200), ctx.status(200), ctx.json(journalposter))
  }),*/

  rest.get<any, { journalpostID: string }, any>(`/api/journalpost/:journalpostID`, async (req, res, ctx) => {
    const journalpostID = req.params.journalpostID
    const journalpost = await journalpostStore.hent(journalpostID)

    if (journalpost) {
      return res(ctx.delay(200), ctx.status(200), ctx.json(journalpost))
    } else if (journalpostID === '403') {
      return res(ctx.status(403))
    } else if (journalpostID === '500') {
      return res(ctx.status(500))
    } else {
      return res(ctx.status(404))
    }
  }),
  rest.get<any, { journalpostID: string; dokumentID: string }, any>(
    `/api/journalpost/:journalpostID/:dokumentID`,
    async (req, res, ctx) => {
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
        ctx.delay(500),
        ctx.set('Content-Length', buffer.byteLength.toString()),
        ctx.set('Content-Type', 'application/pdf'),
        ctx.body(buffer)
      )
    }
  ),
  rest.post<JournalføringRequest, any, OpprettetSakResponse>(
    `/api/journalpost/:journalpostID/journalforing`,
    async (req, res, ctx) => {
      const journalføring = await req.json<JournalføringRequest>()

      const eksisternedeSakId = journalføring.sakId
      const tittel = journalføring.tittel

      await journalpostStore.journalfør(journalføring.journalpostID, tittel)

      if (eksisternedeSakId) {
        barnebrillesakStore.knyttJournalpostTilSak(journalføring)
        return res(ctx.delay(500), ctx.status(200), ctx.json({ sakId: eksisternedeSakId }))
      } else {
        const sakId = await barnebrillesakStore.opprettSak(journalføring)
        return res(ctx.delay(500), ctx.status(200), ctx.json({ sakId: sakId.toString() }))
      }
    }
  ),
  rest.post<any, { journalpostID: string }>(`/api/journalpost/:journalpostID/tildeling`, async (req, res, ctx) => {
    await journalpostStore.tildel(req.params.journalpostID)
    return res(ctx.delay(500), ctx.status(200))
  }),
]
