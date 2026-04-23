import { useLocalState } from '../state/useLocalState.ts'

export function useDarkMode() {
  return useLocalState('darkmode', false)
}
