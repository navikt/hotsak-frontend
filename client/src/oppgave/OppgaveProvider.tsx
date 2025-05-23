import { ReactNode, useMemo, useState } from 'react'

import { GjeldendeOppgave, OppgaveContext, OppgaveContextType } from './OppgaveContext.ts'

/**
 * Holder på hvilken oppgave vi er i kontekst av.
 */
export function OppgaveProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Partial<GjeldendeOppgave>>({})
  const value = useMemo<OppgaveContextType>(() => {
    return {
      ...state,
      setGjeldendeOppgave(oppgave) {
        if (!oppgave) {
          setState({})
          return
        }

        if (
          !(state.oppgaveId === oppgave.oppgaveId && state.versjon === oppgave.versjon && state.sakId === oppgave.sakId)
        ) {
          setState(oppgave)
        }
      },
    }
  }, [state])
  return <OppgaveContext value={value}>{children}</OppgaveContext>
}
