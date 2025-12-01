import { type OppgaveTildelt, Oppgavetype, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { useOppgaver } from '../oppgave/useOppgaver.ts'

const pageNumber = 1
const pageSize = 1_000

export function useJournalføringsoppgaver(tildelt?: OppgaveTildelt) {
  return useOppgaver({
    tildelt,
    statuskategori: Statuskategori.ÅPEN,
    oppgavetype: [Oppgavetype.JOURNALFØRING],
    page: pageNumber,
    limit: pageSize,
  })
}
