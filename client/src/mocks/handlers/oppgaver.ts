import { rest } from 'msw'

import dayjs from 'dayjs'
import {
  DokumentOppgaveStatusType,
  OmrådeFilter,
  OppgaveV2,
  OppgaverResponse,
  Oppgavestatus,
  Oppgavetype,
} from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import { enheter } from '../data/enheter'

// TODO: Lag egen oppgavestore for å hente oppgaver
export const oppgaveHandlers: StoreHandlersFactory = ({ journalpostStore }) => [
  // dokumenter for saksbehandlers enhet hvor status != endelig journalført
  rest.get(`/api/oppgaver-v2`, async (req, res, ctx) => {
    const journalposter = await journalpostStore.alle()
    const oppgaver: OppgaveV2[] = journalposter.map((jp, idx) => {
      return {
        id: idx.toString(),
        oppgavetype: Oppgavetype.JOURNALFØRING,
        oppgavestatus: journalpostStatus2Oppgavestatus(jp.status),
        beskrivelse: jp.tittel,
        område: OmrådeFilter.SYN,
        enhet: enheter.agder,
        saksbehandler: jp.saksbehandler,
        journalpostId: jp.journalpostID,
        frist: dayjs().add(3, 'weeks').toISOString(),
        opprettet: dayjs().toISOString(),
        bruker: {
          fnr: jp.innsender.fnr,
          fulltNavn: jp.innsender.navn,
        },
        innsender: {
          fnr: jp.innsender.fnr,
          fulltNavn: jp.innsender.navn,
        },
      }
    })

    const pagedOppgaver: OppgaverResponse = {
      oppgaver: oppgaver,
      totalCount: oppgaver.length,
    }

    return res(ctx.delay(200), ctx.status(200), ctx.json(pagedOppgaver))
  }),
]

const journalpostStatus2Oppgavestatus = (jouralpostStatus: DokumentOppgaveStatusType): Oppgavestatus => {
  switch (jouralpostStatus) {
    case DokumentOppgaveStatusType.MOTTATT:
      return Oppgavestatus.OPPRETTET
    case DokumentOppgaveStatusType.TILDELT_SAKSBEHANDLER:
    case DokumentOppgaveStatusType.AVVENTER_JOURNALFØRING:
      return Oppgavestatus.UNDER_BEHANDLING
    case DokumentOppgaveStatusType.JOURNALFØRT:
      return Oppgavestatus.FERDIGSTILT
  }
}