import { createContext, useContext } from 'react'

import type { OppgaveBase } from './oppgaveTypes.ts'

export interface OppgaveContextType extends Partial<OppgaveBase> {
  erIOppgavekontekst: boolean
}

const initialState: OppgaveContextType = {
  erIOppgavekontekst: false,
}

export const OppgaveContext = createContext<OppgaveContextType>(initialState)
OppgaveContext.displayName = 'Oppgave'

export function useOppgaveContext() {
  return useContext(OppgaveContext)
}
