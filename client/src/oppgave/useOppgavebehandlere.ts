import useSwr, { KeyedMutator } from 'swr'

import type { Ansatt } from '../tilgang/Ansatt.ts'
import { useOppgaveContext } from './OppgaveContext.ts'

export interface Oppgavebehandlere {
  behandlere: Ansatt[]
}

export function useOppgavebehandlere(): Oppgavebehandlere & {
  mutate: KeyedMutator<Oppgavebehandlere>
  isValidating: boolean
} {
  const { oppgaveId } = useOppgaveContext()
  const { data, error, mutate, isValidating } = useSwr<Oppgavebehandlere>(
    oppgaveId ? `/api/oppgaver-v2/${oppgaveId}/behandlere` : null
  )
  if (error) {
    return { behandlere: [], mutate, isValidating }
  }
  return {
    behandlere: data?.behandlere ?? [],
    mutate,
    isValidating,
  }
}
