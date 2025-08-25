import { useLocalState } from '../state/useLocalState.ts'

export function useDarkmode() {
  return useLocalState('darkmode', false)
}
