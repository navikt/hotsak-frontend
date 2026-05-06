import { createContext, type Dispatch, useCallback, useContext } from 'react'

export enum OppgaveModalType {
  SETT_PÅ_VENT,
  FORTSETT_BEHANDLING,
  ENDRE_GJELDER,
  OVERFØR_TIL_MEDARBEIDER,
  LEGG_TILBAKE,
}

export interface OppgaveState {
  isOppgaveContext: boolean
  åpenModal?: OppgaveModalType
  sakId?: ID
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
  type: 'åpneModal' | 'lukkModal' | 'sakEndret'
}

export interface OppgaveÅpneModalAction extends OppgaveBaseAction {
  type: 'åpneModal'
  åpenModal: OppgaveModalType
}

export interface OppgaveLukkModalAction extends OppgaveBaseAction {
  type: 'lukkModal'
}

export interface OppgaveSakEndretAction extends OppgaveBaseAction {
  type: 'sakEndret'
  sakId?: ID
}

export type OppgaveAction = OppgaveÅpneModalAction | OppgaveLukkModalAction | OppgaveSakEndretAction
