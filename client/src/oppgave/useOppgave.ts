import useSwr from 'swr'
import { useParams } from 'react-router'
import { useDebugValue } from 'react'

import type { OppgaveApiOppgave, OppgaveId } from './oppgaveTypes.ts'
import { useOppgaveContext } from './OppgaveContext.ts'

export function useOppgaveId(): OppgaveId | undefined {
  const { oppgaveId: oppgaveIdUrl } = useParams<{ oppgaveId: OppgaveId }>()
  const { oppgaveId: oppgaveIdOppgave } = useOppgaveContext()
  const oppgaveId = oppgaveIdUrl ?? oppgaveIdOppgave
  useDebugValue(oppgaveId)
  return oppgaveId
}

export function useOppgave() {
  const oppgaveId = useOppgaveId()
  const { data, ...rest } = useSwr<OppgaveApiOppgave>(oppgaveId ? `/api/oppgaver-v2/${oppgaveId}` : null)
  return {
    oppgave: data,
    ...rest,
  }
}
