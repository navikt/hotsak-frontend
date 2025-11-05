import useSWR from 'swr'
import { HttpError } from '../../io/HttpError.ts'
import { OppgaveId } from '../../oppgave/oppgaveTypes.ts'

export interface OppgaveKommentar {
  tekst: string
  registrertAv: string
  registrertAvEnhetsnummer: string
  registrertAvSystem: string
  registrertTidspunkt: string
  legacy: boolean
}

export function useOppgavekommentarer(oppgaveId: OppgaveId | null) {
  return useSWR<OppgaveKommentar[], HttpError>(oppgaveId ? `/api/oppgaver-v2/${oppgaveId}/kommentarer` : null)
}
