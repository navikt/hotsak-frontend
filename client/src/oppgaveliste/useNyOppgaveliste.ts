import { useLocalState } from '../state/useLocalState.ts'

export function useNyOppgaveliste() {
  return useLocalState('nyOppgaveliste', false)
}
