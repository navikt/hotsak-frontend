import useSWR, { mutate } from 'swr'

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
  oppgaveId: OppgaveId
}

export function useOppgavekommentarer(oppgaveId?: OppgaveId) {
  const { data: kommentarer = ingenKommentarer, ...rest } = useSWR<Oppgavekommentar[], HttpError>(
    oppgaveId ? `/api/oppgaver/${oppgaveId}/kommentarer` : null
  )
  return { kommentarer, antallKommentarer: kommentarer.length, ...rest }
}

const ingenKommentarer: Oppgavekommentar[] = []

export function mutateOppgavekommentarer(oppgaveId: OppgaveId, kommentarer?: Oppgavekommentar[]) {
  return mutate(`/api/oppgaver/${oppgaveId}/kommentarer`, kommentarer)
}

export function useOppgavekommentarerForSak(sakId?: ID) {
  const { data: kommentarer = ingenKommentarer, ...rest } = useSWR<Oppgavekommentar[], HttpError>(
    sakId ? `/api/sak/${sakId}/kommentarer` : null
  )
  return { kommentarer, antallKommentarer: kommentarer.length, ...rest }
}

export function mutateOppgavekommentarerForSak(sakId: ID, kommentarer?: Oppgavekommentar[]) {
  return mutate(`/api/sak/${sakId}/kommentarer`, kommentarer)
}
