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

export type OppgavelisteColumnsState = ReadonlyArray<OppgaveColumnState>

export const OppgavelisteColumnsContext = createContext<OppgavelisteColumnsState>([])
OppgavelisteColumnsContext.displayName = 'OppgavelisteColumnsContext'

export const OppgavelisteColumnsDispatch = createContext<Dispatch<OppgavelisteColumnsAction>>((state) => state)
OppgavelisteColumnsDispatch.displayName = 'OppgavelisteColumnsDispatch'

export function useOppgavelisteColumnsContext(): OppgavelisteColumnsState {
  return useContext(OppgavelisteColumnsContext)
}

export function useOppgavelisteColumnsDispatch(): Dispatch<OppgavelisteColumnsAction> {
  return useContext(OppgavelisteColumnsDispatch)
}

export function useOppgavelisteColumnToggleColumnHandler(id: OppgaveColumnField): (checked: boolean) => void {
  const dispatch = useOppgavelisteColumnsDispatch()
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

export function useOppgavelisteColumnsMoveColumnHandler(): (event: DragEndEvent) => void {
  const dispatch = useOppgavelisteColumnsDispatch()
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

export function useOppgavelisteColumnsResetAllHandler(): () => void {
  const dispatch = useOppgavelisteColumnsDispatch()
  return useCallback(() => {
    dispatch({
      type: 'resetAll',
    })
  }, [dispatch])
}

export function useIsOppgavelisteCustomized() {
  const state = useOppgavelisteColumnsContext()
  return useMemo(
    () => state.some((column) => column.checked !== column.defaultChecked || column.order !== column.defaultOrder),
    [state]
  )
}

interface OppgavelisteColumnsBaseAction {
  type: 'addColumn' | 'removeColumn' | 'moveColumn' | 'resetAll'
}

export interface OppgavelisteColumnsAddColumnAction extends OppgavelisteColumnsBaseAction {
  type: 'addColumn'
  id: OppgaveColumnField
}

export interface OppgavelisteColumnsRemoveColumnAction extends OppgavelisteColumnsBaseAction {
  type: 'removeColumn'
  id: OppgaveColumnField
}

export interface OppgavelisteColumnsMoveColumnAction extends OppgavelisteColumnsBaseAction {
  type: 'moveColumn'
  activeId: OppgaveColumnField | UniqueIdentifier
  overId: OppgaveColumnField | UniqueIdentifier
}

export interface OppgavelisteColumnsResetAllAction extends OppgavelisteColumnsBaseAction {
  type: 'resetAll'
}

export type OppgavelisteColumnsAction =
  | OppgavelisteColumnsAddColumnAction
  | OppgavelisteColumnsRemoveColumnAction
  | OppgavelisteColumnsMoveColumnAction
  | OppgavelisteColumnsResetAllAction
