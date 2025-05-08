import useSwr from 'swr'

import type { Ansatt } from '../tilgang/Ansatt.ts'
import { useOppgaveContext } from './OppgaveContext.ts'

export interface Oppgavebehandlere {
  behandlere: Ansatt[]
}

export function useOppgavebehandlere(): Oppgavebehandlere {
  const { oppgaveId } = useOppgaveContext()
  const { data, error } = useSwr<Oppgavebehandlere>(oppgaveId ? `/api/oppgaver-v2/${oppgaveId}/behandlere` : null)
  if (error) {
    return { behandlere: [] }
  }
  return {
    behandlere: data?.behandlere ?? [],
  }
}
