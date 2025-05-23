import { createContext, useContext } from 'react'
import type { OppgaveId } from './oppgaveId.ts'

export interface GjeldendeOppgave {
  oppgaveId: OppgaveId
  versjon: number

  /**
   * NB! Journalføringsoppgaver har ikke `sakId`.
   */
  sakId?: string | number
}

export interface OppgaveContextType extends Partial<GjeldendeOppgave> {
  setGjeldendeOppgave(oppgave?: GjeldendeOppgave): void
}

const initialState: OppgaveContextType = {
  setGjeldendeOppgave() {},
}

export const OppgaveContext = createContext<OppgaveContextType>(initialState)
OppgaveContext.displayName = 'Oppgave'

export function useOppgaveContext() {
  return useContext(OppgaveContext)
}

export function lagGjeldendeOppgave(
  oppgaveId?: OppgaveId,
  versjon: number = -1,
  sakId?: string | number
): GjeldendeOppgave | undefined {
  if (oppgaveId) {
    return { oppgaveId, versjon, sakId }
  }
  if (sakId) {
    return { oppgaveId: `S-${sakId}`, versjon, sakId }
  }
  return
}
