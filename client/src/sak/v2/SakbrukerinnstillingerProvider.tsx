import { type ReactNode } from 'react'

import { useLocalReducer } from '../../state/useLocalReducer.ts'
import {
  initialSakbrukerinnstillingerState,
  type SakbrukerinnstillingerAction,
  SakbrukerinnstillingerContext,
  SakbrukerinnstillingerDispatch,
  type SakbrukerinnstillingerState,
} from './SakbrukerinnstillingerContext.ts'

export function SakbrukerinnstillingerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useLocalReducer('sakBrukerinnstillinger', reducer, initialSakbrukerinnstillingerState)
  return (
    <SakbrukerinnstillingerContext value={state}>
      <SakbrukerinnstillingerDispatch value={dispatch}>{children}</SakbrukerinnstillingerDispatch>
    </SakbrukerinnstillingerContext>
  )
}

function reducer(
  state: SakbrukerinnstillingerState,
  action: SakbrukerinnstillingerAction
): SakbrukerinnstillingerState {
  switch (action.type) {
    case 'setExpanded':
      return {
        ...state,
        expandedSections: {
          ...state.expandedSections,
          [action.key]: action.expanded,
        },
      }
    case 'toggleExpanded':
      return {
        ...state,
        expandedSections: {
          ...state.expandedSections,
          [action.key]: !state.expandedSections[action.key],
        },
      }
    default:
      return state
  }
}
