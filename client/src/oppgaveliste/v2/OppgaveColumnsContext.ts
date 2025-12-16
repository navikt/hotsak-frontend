import { createContext, type Dispatch, useContext } from 'react'

import { type OppgaveColumnField, type OppgaveColumnState } from './oppgaveColumns.tsx'

export type OppgaveColumnsState = ReadonlyArray<OppgaveColumnState>

export const OppgaveColumnsContext = createContext<OppgaveColumnsState>([])
export const OppgaveColumnsDispatchContext = createContext<Dispatch<OppgaveColumnsAction>>((state) => state)

export function useOppgaveColumnsContext(): OppgaveColumnsState {
  return useContext(OppgaveColumnsContext)
}

export function useOppgaveColumnsDispatchContext(): Dispatch<OppgaveColumnsAction> {
  return useContext(OppgaveColumnsDispatchContext)
}

interface OppgaveColumnsBaseAction {
  type: 'checked' | 'unchecked'
  field: OppgaveColumnField
}

export interface OppgaveColumnsCheckedAction extends OppgaveColumnsBaseAction {
  type: 'checked'
}

export interface OppgaveColumnsUncheckedAction extends OppgaveColumnsBaseAction {
  type: 'unchecked'
}

export type OppgaveColumnsAction = OppgaveColumnsCheckedAction | OppgaveColumnsUncheckedAction
