import { rest } from 'msw'

import dayjs from 'dayjs'
import {
    DokumentOppgaveStatusType,
    OmrådeFilter,
    OppgaverResponse,
    Oppgavestatus,
    Oppgavetype,
    OppgaveV2,
} from '../../types/types.internal'
import { formatName } from '../../utils/stringFormating'
import type { StoreHandlersFactory } from '../data'
import { enheter } from '../data/enheter'

export const oppgaveHandlers: StoreHandlersFactory = ({ journalpostStore, oppgaveStore }) => [
  rest.get(`/api/oppgaver-v2`, async (req, res, ctx) => {
    const oppgavetype = req.url.searchParams.get('oppgavetype')

    // Midlertidig workaround frem til vi har en mer fungerende oppgavemodell i mocken.
    // Hvis oppgavetype er journalføring, kommer kallet fra dokumentlista og da viser vi førelpig journalføringer fra Journalføringstore
    // hvis ikke henter vi alle oppgaver fra oppgavestore, men den brukes kun fra eksperimentell oppgavebenk og vi vet enda ikke helt hvordan
    // Enn så lenge er det ikke noe logikk i mocken for å holde oppgavestore oppdatert
    if (oppgavetype === 'JOURNALFØRING') {
      const journalposter = await journalpostStore.alle()
      const oppgaver: OppgaveV2[] = journalposter.map((jp) => {
        return {
          id: jp.journalpostID,
          oppgavetype: Oppgavetype.JOURNALFØRING,
          oppgavestatus: journalpostStatus2Oppgavestatus(jp.status),
          beskrivelse: jp.tittel,
          område: [OmrådeFilter.SYN],
          enhet: enheter.agder,
          saksbehandler: jp.saksbehandler,
          journalpostId: jp.journalpostID,
          frist: dayjs().add(3, 'weeks').toISOString(),
          opprettet: dayjs().toISOString(),
          bruker: {
            fnr: jp.innsender.fnr,
            fulltNavn: formatName(jp.innsender.navn),
          },
          innsender: {
            fnr: jp.innsender.fnr,
            fulltNavn: formatName(jp.innsender.navn),
          },
        }
      })

      const pagedOppgaver: OppgaverResponse = {
        oppgaver: oppgaver,
        totalCount: oppgaver.length,
      }

      return res(ctx.delay(200), ctx.status(200), ctx.json(pagedOppgaver))
    } else {
      const oppgaver = await oppgaveStore.alle()
      const pagedOppgaver: OppgaverResponse = {
        oppgaver: oppgaver,
        totalCount: oppgaver.length,
      }
      return res(ctx.delay(200), ctx.status(200), ctx.json(pagedOppgaver))
    }
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
