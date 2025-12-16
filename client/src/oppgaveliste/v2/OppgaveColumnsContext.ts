import { createContext, type Dispatch, useContext } from 'react'

import { type OppgaveColumn, type OppgaveColumnField } from './oppgaveColumns.tsx'

const initialState: OppgaveColumn[] = []

export const OppgaveColumnsContext = createContext(initialState)
export const OppgaveColumnsDispatchContext = createContext<Dispatch<OppgaveColumnsAction>>((state) => state)

export function useOppgaveColumnsContext() {
  return useContext(OppgaveColumnsContext)
}

export function useOppgaveColumnsDispatchContext() {
  return useContext(OppgaveColumnsDispatchContext)
}

export interface OppgaveColumnsBaseAction {
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
