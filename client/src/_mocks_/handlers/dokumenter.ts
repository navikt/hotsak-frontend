import { rest } from 'msw'

import { DokumentOppgaveStatusType, JournalførRequest, OpprettetSakResponse } from '../../types/types.internal'
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
  rest.post<JournalførRequest, any, OpprettetSakResponse>(
    `/api/journalpost/:journalpostID/journalforing`,
    async (req, res, ctx) => {
      const journalpost: JournalførRequest = await req.json()
      const journalpostIdx = dokumentliste.findIndex((dokument) => dokument.journalpostID === journalpost.journalpostID)
      dokumentliste[journalpostIdx]['status'] = DokumentOppgaveStatusType.JOURNALFØRT

      return res(ctx.delay(500), ctx.status(200), ctx.json({ sakID: '9876' }))
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

  /*
  // Sjekker at innlogget saksbehandler har rettighet til å journalføre 
  // Sjekker at journalposten ikke allerede har status endelig journalført 
  // Sender journalføringsevent på rapid 
  // Endrer status til endelig journalført (eller bør det skje asynkront når vi faktisk får ok tilbake fra joark sink?) 
  // Oppretter ny sak av type ? og returnerer saksnummer i response (passer det inn i dagens sak tabell eller gir det mer mening med en egen tabell for behandling av "papirsøknader")
  // Hva slags statuser skal en sak ha her? (må vi granulere UNDER_BEHANDLING mer? Typ informasjonsinnhenting/punching, vilkårsvurdering, brev, simulering osv?)
  
  // Sakshistorikk oppdateres 
  POST /api/journalpost/journalfør 

  {
    'journalpostID': '123456', 
    'tittel': 'Tilskudd ved kjøp av briller til barn',
    'vedlegg': ['Kvittering', 'Brilleseddel'], // vil kun være satt for journalposter sendt inn via skanning. For digitalt innsendte har vi dokumentene som egne filer 
    'journalføresPåfnr': '345435435', // fnr til barnet 
}
  */
]

export default dokumentHandlers
