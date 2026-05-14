import useSWR, { mutate } from 'swr'

import { type HttpError } from '../../io/HttpError.ts'
import { type OppgaveId } from '../oppgaveTypes.ts'

export interface Oppgavekommentar {
  tekst: string
  registrertAv: string
  registrertAvEnhetsnummer: string
  registrertAvSystem: string
  registrertTidspunkt: string
  legacy: boolean
}

export function useOppgavekommentarer(oppgaveId?: Nullable<OppgaveId>) {
  return useSWR<Oppgavekommentar[], HttpError>(oppgaveId ? `/api/oppgaver/${oppgaveId}/kommentarer` : null)
}

export function mutateOppgavekommentarer(oppgaveId: OppgaveId, kommentarer?: Oppgavekommentar[]) {
  return mutate(`/api/oppgaver/${oppgaveId}/kommentarer`, kommentarer)
}
