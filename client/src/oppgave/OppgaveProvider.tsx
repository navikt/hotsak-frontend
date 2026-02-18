import { ReactNode, useMemo } from 'react'

import { OppgaveContext, OppgaveContextType } from './OppgaveContext.ts'
import type { Oppgave } from './oppgaveTypes.ts'

export interface OppgaveProviderProps {
  oppgave: Oppgave
  children: ReactNode
}

/**
 * Holder på hvilken oppgave vi er i kontekst av.
 */
export function OppgaveProvider({ oppgave, children }: OppgaveProviderProps) {
  const value = useMemo<OppgaveContextType>(() => {
    return {
      oppgaveId: oppgave.oppgaveId,
      versjon: oppgave.versjon,
      sakId: oppgave.sakId,
      isOppgaveContext: true,
    }
  }, [oppgave])
  return <OppgaveContext value={value}>{children}</OppgaveContext>
}
