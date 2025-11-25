import { useLocalState } from '../state/useLocalState.ts'
import { useErPilot } from '../tilgang/useTilgang.ts'

export function useNyOppgaveliste() {
  const erPilot = useErPilot('oppgaveintegrasjon')
  return useLocalState('nyOppgaveliste', erPilot)
}
