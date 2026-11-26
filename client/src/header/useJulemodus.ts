import { useLocalState } from '../state/useLocalState.ts'

export function useJulemodus() {
  return useLocalState('julemodus', false)
}
