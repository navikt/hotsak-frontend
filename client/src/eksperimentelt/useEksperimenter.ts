import { useLocalState } from '../state/useLocalState.ts'

export function useEksperimenter() {
  return useLocalState('eksperimentell', false)
}
