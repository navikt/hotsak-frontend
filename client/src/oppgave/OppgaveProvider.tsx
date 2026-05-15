import { type ReactNode, useEffect, useReducer } from 'react'

import { type OppgaveAction, OppgaveContext, OppgaveDispatch, type OppgaveState } from './OppgaveContext.ts'

export interface OppgaveProviderProps {
  sakId?: string
  children: ReactNode
}

export function OppgaveProvider({ sakId, children }: OppgaveProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    isOppgaveContext: true,
    sakId,
    kommentar: {
      tekst: '',
    },
  })

  useEffect(() => {
    dispatch({ type: 'sakEndret', sakId })
  }, [sakId])

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
    case 'kommentar':
      return { ...state, kommentar: { tekst: action.tekst } }
    case 'sakEndret':
      return { ...state, sakId: action.sakId }
    default:
      return state
  }
}
