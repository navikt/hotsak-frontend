import { createContext, Dispatch, useCallback, useContext } from 'react'

import type { OppgaveBase } from './oppgaveTypes.ts'

export enum OppgaveModalType {
  SETT_PÅ_VENT,
  FORTSETT_BEHANDLING,
  ENDRE_GJELDER,
  OVERFØR_TIL_MEDARBEIDER,
  LEGG_TILBAKE,
}

export interface OppgaveState extends Partial<OppgaveBase> {
  isOppgaveContext: boolean
  åpenModal?: OppgaveModalType
}

const initialState: OppgaveState = {
  isOppgaveContext: false,
}

export const OppgaveContext = createContext<OppgaveState>(initialState)
OppgaveContext.displayName = 'OppgaveContext'

export const OppgaveDispatch = createContext<Dispatch<OppgaveAction>>((state) => state)
OppgaveContext.displayName = 'OppgaveDispatch'

export function useOppgaveContext(): OppgaveState {
  return useContext(OppgaveContext)
}

export function useOppgaveDispatch(): Dispatch<OppgaveAction> {
  return useContext(OppgaveDispatch)
}

export function useOppgaveÅpneModalHandler() {
  const dispatch = useOppgaveDispatch()
  return useCallback(
    (åpenModal: OppgaveModalType) =>
      dispatch({
        type: 'åpneModal',
        åpenModal,
      }),
    [dispatch]
  )
}

export function useOppgaveLukkModalHandler() {
  const dispatch = useOppgaveDispatch()
  return useCallback(
    () =>
      dispatch({
        type: 'lukkModal',
      }),
    [dispatch]
  )
}

export interface OppgaveBaseAction {
  type: 'åpneModal' | 'lukkModal' | 'versjonEndret'
}

export interface OppgaveÅpneModalAction extends OppgaveBaseAction {
  type: 'åpneModal'
  åpenModal: OppgaveModalType
}

export interface OppgaveLukkModalAction extends OppgaveBaseAction {
  type: 'lukkModal'
}

export interface OppgaveVersjonEndretAction extends OppgaveBaseAction {
  type: 'versjonEndret'
  versjon: number
}

export type OppgaveAction = OppgaveÅpneModalAction | OppgaveLukkModalAction | OppgaveVersjonEndretAction
