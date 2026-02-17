import { type DragEndEvent, type UniqueIdentifier } from '@dnd-kit/core'
import { createContext, type Dispatch, useCallback, useContext, useMemo } from 'react'

import { type OppgaveColumnField } from './oppgaveColumns.tsx'

export interface OppgaveColumnState {
  id: OppgaveColumnField
  checked: boolean
  defaultChecked: boolean
  order: number
  defaultOrder: number
}

export type OppgaveColumnsState = ReadonlyArray<OppgaveColumnState>

export const OppgaveColumnsContext = createContext<OppgaveColumnsState>([])
export const OppgaveColumnsDispatchContext = createContext<Dispatch<OppgaveColumnsAction>>((state) => state)

export function useOppgaveColumnsContext(): OppgaveColumnsState {
  return useContext(OppgaveColumnsContext)
}

export function useOppgaveColumnsDispatch(): Dispatch<OppgaveColumnsAction> {
  return useContext(OppgaveColumnsDispatchContext)
}

export function useOppgaveColumnToggleColumnHandler(id: OppgaveColumnField): (checked: boolean) => void {
  const dispatch = useOppgaveColumnsDispatch()
  return useCallback(
    (checked) => {
      dispatch({
        type: checked ? 'addColumn' : 'removeColumn',
        id,
      })
    },
    [dispatch, id]
  )
}

export function useOppgaveColumnsMoveColumnHandler(): (event: DragEndEvent) => void {
  const dispatch = useOppgaveColumnsDispatch()
  return useCallback(
    (event) => {
      const { active, over } = event
      if (over && active.id !== over.id) {
        dispatch({
          type: 'moveColumn',
          activeId: active.id,
          overId: over.id,
        })
      }
    },
    [dispatch]
  )
}

export function useOppgaveColumnsResetAllHandler(): () => void {
  const dispatch = useOppgaveColumnsDispatch()
  return useCallback(() => {
    dispatch({
      type: 'resetAll',
    })
  }, [dispatch])
}

export function useIsTableCustomized() {
  const state = useOppgaveColumnsContext()
  return useMemo(
    () => state.some((column) => column.checked !== column.defaultChecked || column.order !== column.defaultOrder),
    [state]
  )
}

interface OppgaveColumnsBaseAction {
  type: 'addColumn' | 'removeColumn' | 'moveColumn' | 'resetAll'
}

export interface OppgaveColumnsAddColumnAction extends OppgaveColumnsBaseAction {
  type: 'addColumn'
  id: OppgaveColumnField
}

export interface OppgaveColumnsRemoveColumnAction extends OppgaveColumnsBaseAction {
  type: 'removeColumn'
  id: OppgaveColumnField
}

export interface OppgaveColumnsMoveColumnAction extends OppgaveColumnsBaseAction {
  type: 'moveColumn'
  activeId: OppgaveColumnField | UniqueIdentifier
  overId: OppgaveColumnField | UniqueIdentifier
}

export interface OppgaveColumnsResetAllAction extends OppgaveColumnsBaseAction {
  type: 'resetAll'
}

export type OppgaveColumnsAction =
  | OppgaveColumnsAddColumnAction
  | OppgaveColumnsRemoveColumnAction
  | OppgaveColumnsMoveColumnAction
  | OppgaveColumnsResetAllAction
