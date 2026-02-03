import { useLocalState } from '../../state/useLocalState.ts'

export function useNyttSaksbilde() {
  return useLocalState('nyttSaksbilde', false)
}
