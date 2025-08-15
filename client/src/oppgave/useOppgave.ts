import { useDebugValue } from 'react'
import { useParams } from 'react-router'
import useSwr from 'swr'

import { useOptionalOppgaveContext } from './OppgaveContext.ts'
import type { OppgaveId, OppgaveV2 } from './oppgaveTypes.ts'

export function useOppgaveId(): OppgaveId | undefined {
  const { oppgaveId: oppgaveIdUrl } = useParams<{ oppgaveId: OppgaveId }>()
  const { oppgaveId: oppgaveIdOppgave } = useOptionalOppgaveContext()
  const oppgaveId = oppgaveIdUrl ?? oppgaveIdOppgave
  useDebugValue(oppgaveId)
  return oppgaveId
}

export function useOppgave() {
  const oppgaveId = useOppgaveId()
  const { data, ...rest } = useSwr<OppgaveV2>(oppgaveId ? `/api/oppgaver-v2/${oppgaveId}` : null)
  return {
    oppgave: data,
    ...rest,
  }
}
