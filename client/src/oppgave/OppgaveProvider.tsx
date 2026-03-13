import { ReactNode, useReducer } from 'react'

import { type OppgaveAction, OppgaveContext, OppgaveDispatch, type OppgaveState } from './OppgaveContext.ts'
import type { Oppgave } from './oppgaveTypes.ts'

export interface OppgaveProviderProps {
  oppgave: Oppgave
  children: ReactNode
}

/**
 * Holder på hvilken oppgave vi er i kontekst av.
 */
export function OppgaveProvider({ oppgave, children }: OppgaveProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    oppgaveId: oppgave.oppgaveId,
    versjon: oppgave.versjon,
    sakId: oppgave.sakId,
    isOppgaveContext: true,
  })
  return (
    <OppgaveContext value={state}>
      <OppgaveDispatch value={dispatch}>{children}</OppgaveDispatch>
    </OppgaveContext>
  )
}

function reducer(state: OppgaveState, action: OppgaveAction): OppgaveState {
  switch (action.type) {
    case 'åpneModal':
      return { ...state, åpenModal: action.åpenModal }
    case 'lukkModal':
      return { ...state, åpenModal: undefined }
    default:
      return state
  }
}
