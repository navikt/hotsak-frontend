import { ReactNode, useMemo } from 'react'

import { OppgaveContext, OppgaveContextType } from './OppgaveContext.ts'
import type { OppgaveBase } from './oppgaveTypes.ts'

export interface OppgaveProviderProps {
  oppgave: OppgaveBase
  children: ReactNode
}

/**
 * Holder på hvilken oppgave vi er i kontekst av.
 */
export function OppgaveProvider({ oppgave, children }: OppgaveProviderProps) {
  const value = useMemo<OppgaveContextType>(() => {
    return {
      ...oppgave,
      erIOppgavekontekst: !!oppgave.oppgaveId,
    }
  }, [oppgave])
  return <OppgaveContext value={value}>{children}</OppgaveContext>
}
