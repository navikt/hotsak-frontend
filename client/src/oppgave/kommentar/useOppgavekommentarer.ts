import useSWR, { mutate, type SWRResponse } from 'swr'

import { type HttpError } from '../../io/HttpError.ts'
import { type UtførtAv } from '../../tilgang/UtførtAv.ts'
import { type Enhet } from '../../types/hotlibs.ts'
import { type OppgaveId } from '../oppgaveTypes.ts'

export interface Oppgavekommentar {
  tekst: string
  registrertAv: UtførtAv
  registrertAvEnhet: Enhet
  registrertAvSystem: string
  registrertTidspunkt: string
}

export interface UseOppgavekommentarerResponse extends Omit<SWRResponse<Oppgavekommentar[], HttpError>, 'data'> {
  kommentarer: Oppgavekommentar[]
  antallKommentarer: number
}

export function useOppgavekommentarer(oppgaveId?: Nullable<OppgaveId>): UseOppgavekommentarerResponse {
  const { data: kommentarer = ingenKommentarer, ...rest } = useSWR<Oppgavekommentar[], HttpError>(
    oppgaveId ? `/api/oppgaver/${oppgaveId}/kommentarer` : null
  )
  return { kommentarer, antallKommentarer: kommentarer.length, ...rest }
}

const ingenKommentarer: Oppgavekommentar[] = []

export function mutateOppgavekommentarer(oppgaveId: OppgaveId, kommentarer?: Oppgavekommentar[]) {
  return mutate(`/api/oppgaver/${oppgaveId}/kommentarer`, kommentarer)
}
