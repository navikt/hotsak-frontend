import dayjs from 'dayjs'

import type { Journalpost } from '../../types/types.internal'
import { DokumentFormat, DokumentOppgaveStatusType, JournalpostStatusType } from '../../types/types.internal'
import { enheter } from './enheter'
import { groupBy, nextId } from './felles'
import { innloggetSaksbehandler } from './saksbehandlere'

const nå = dayjs()

export function lagJournalpost(journalpostId: string = nextId().toString()): Journalpost {
  return {
    journalpostID: journalpostId,
    journalstatus: JournalpostStatusType.MOTTATT,
    status: DokumentOppgaveStatusType.JOURNALFØRT,
    journalpostOpprettetTid: nå.toISOString(),
    fnrInnsender: '15084300133',
    tittel: 'Tilskudd ved kjøp av briller til barn',
    enhet: enheter.agder,
    saksbehandler: innloggetSaksbehandler.s1,
    dokumenter: [
      {
        dokumentID: nextId().toString(),
        tittel: 'Tilskudd ved kjøp av briller til barn',
        brevkode: 'NAV 10-07.34',
        vedlegg: [],
        varianter: [{ format: DokumentFormat.ORIGINAL }, { format: DokumentFormat.ARKIV }],
      },
      {
        dokumentID: nextId().toString(),
        tittel: 'Originalkvittering',
        brevkode: 'X5',
        vedlegg: [],
        varianter: [{ format: DokumentFormat.ARKIV }],
      },
      {
        dokumentID: nextId().toString(),
        tittel: 'Kvitteringsside for dokumentinnsending',
        brevkode: 'L7',
        vedlegg: [],
        varianter: [{ format: DokumentFormat.ARKIV }],
      },
    ],
  }
}

export const journalposter: Journalpost[] = [
  lagJournalpost(),
  lagJournalpost(),
  lagJournalpost(),
  lagJournalpost(),
  lagJournalpost(),
]

export const journalposterByJournalpostId: Record<string, Journalpost> = groupBy(
  journalposter,
  ({ journalpostID }) => journalpostID
)
