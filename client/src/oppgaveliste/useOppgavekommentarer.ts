import useSWR from 'swr'
import { type HttpError } from '../io/HttpError.ts'
import { type OppgaveId } from '../oppgave/oppgaveTypes.ts'

export interface OppgaveKommentar {
  tekst: string
  registrertAv: string
  registrertAvEnhetsnummer: string
  registrertAvSystem: string
  registrertTidspunkt: string
  legacy: boolean
}

export function useOppgavekommentarer(oppgaveId?: Nullable<OppgaveId>) {
  return useSWR<OppgaveKommentar[], HttpError>(oppgaveId ? `/api/oppgaver/${oppgaveId}/kommentarer` : null)
}
