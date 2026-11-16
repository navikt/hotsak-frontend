import useSwr, { KeyedMutator } from 'swr'

import type { Ansatt } from '../tilgang/Ansatt.ts'
import { type OppgaveId } from './oppgaveTypes.ts'
import { useOppgave } from './useOppgave.ts'

export interface Oppgavebehandlere {
  behandlere: ReadonlyArray<Ansatt>
}

/**
 * @param oppgaveIdOverride angis hvis hooken brukes utenfor oppgavekontekst (f.eks. i oppgavelisten)
 */
export function useOppgavebehandlere(oppgaveIdOverride?: OppgaveId): Oppgavebehandlere & {
  mutate: KeyedMutator<Oppgavebehandlere>
  isValidating: boolean
} {
  const { oppgaveId: oppgaveIdFraKontekst } = useOppgave().oppgave ?? {}
  const oppgaveId = oppgaveIdOverride ?? oppgaveIdFraKontekst
  const { data, error, mutate, isValidating } = useSwr<Oppgavebehandlere>(
    oppgaveId ? `/api/oppgaver/${oppgaveId}/behandlere` : null
  )
  if (error) {
    return { behandlere: [], mutate, isValidating }
  }
  return {
    behandlere: data?.behandlere ?? [],
    mutate,
    isValidating,
  }
}
