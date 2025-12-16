import { createContext, type Dispatch, useCallback, useContext } from 'react'

import { type OppgaveColumnField, type OppgaveColumnState } from './oppgaveColumns.tsx'

export type OppgaveColumnsState = ReadonlyArray<OppgaveColumnState>

export const OppgaveColumnsContext = createContext<OppgaveColumnsState>([])
export const OppgaveColumnsDispatchContext = createContext<Dispatch<OppgaveColumnsAction>>((state) => state)

export function useOppgaveColumnsContext(): OppgaveColumnsState {
  return useContext(OppgaveColumnsContext)
}

export function useOppgaveColumnsDispatch(): Dispatch<OppgaveColumnsAction> {
  return useContext(OppgaveColumnsDispatchContext)
}

export function useOppgaveColumnChange(field: OppgaveColumnField): (checked: boolean) => void {
  const dispatch = useOppgaveColumnsDispatch()
  return useCallback(
    (checked) => {
      dispatch({
        type: checked ? 'checked' : 'unchecked',
        field,
      })
    },
    [dispatch, field]
  )
}

export function useOppgaveColumnsReset(): (event: Event) => void {
  const dispatch = useOppgaveColumnsDispatch()
  return useCallback(() => {
    dispatch({
      type: 'reset',
    })
  }, [dispatch])
}

interface OppgaveColumnsBaseAction {
  type: 'checked' | 'unchecked' | 'reset'
}

export interface OppgaveColumnsCheckedAction extends OppgaveColumnsBaseAction {
  type: 'checked'
  field: OppgaveColumnField
}

export interface OppgaveColumnsUncheckedAction extends OppgaveColumnsBaseAction {
  type: 'unchecked'
  field: OppgaveColumnField
}

export interface OppgaveColumnsResetAction extends OppgaveColumnsBaseAction {
  type: 'reset'
}

export type OppgaveColumnsAction =
  | OppgaveColumnsCheckedAction
  | OppgaveColumnsUncheckedAction
  | OppgaveColumnsResetAction
