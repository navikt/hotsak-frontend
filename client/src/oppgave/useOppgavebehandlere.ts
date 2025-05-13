import useSwr, { KeyedMutator } from 'swr'

import type { Ansatt } from '../tilgang/Ansatt.ts'
import { useOppgaveContext } from './OppgaveContext.ts'

export interface Oppgavebehandlere {
  behandlere: Ansatt[]
}

export function useOppgavebehandlere(): Oppgavebehandlere & { mutate: KeyedMutator<Oppgavebehandlere> } {
  const { oppgaveId } = useOppgaveContext()
  const { data, error, mutate } = useSwr<Oppgavebehandlere>(
    oppgaveId ? `/api/oppgaver-v2/${oppgaveId}/behandlere` : null
  )
  if (error) {
    return { behandlere: [], mutate }
  }
  return {
    behandlere: data?.behandlere ?? [],
    mutate,
  }
}
