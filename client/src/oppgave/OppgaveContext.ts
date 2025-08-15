import { createContext, useContext } from 'react'
import type { SetRequired } from 'type-fest'

import type { OppgaveBase, OppgaveV2 } from './oppgaveTypes.ts'

export interface OppgaveContextType extends Partial<OppgaveBase> {
  oppgave?: OppgaveV2
}

const initialState: OppgaveContextType = {}

export const OppgaveContext = createContext<OppgaveContextType>(initialState)
OppgaveContext.displayName = 'Oppgave'

export function useOptionalOppgaveContext() {
  return useContext(OppgaveContext)
}

export function useErIOppgavekontekst(): boolean {
  return useOptionalOppgaveContext().oppgave != null
}

export function useRequiredOppgaveContext(): SetRequired<OppgaveContextType, 'oppgaveId' | 'versjon' | 'oppgave'> {
  const { oppgaveId, versjon, sakId, oppgave, ...rest } = useOptionalOppgaveContext()
  if (oppgaveId == null || versjon == null || oppgave == null) {
    throw new Error('Oppgave er ikke satt')
  }
  return { oppgaveId, versjon, sakId, oppgave, ...rest }
}
