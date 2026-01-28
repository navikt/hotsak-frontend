import { useUmami } from '../sporing/useUmami.ts'
import { useLocalState } from '../state/useLocalState.ts'
import { useErPilot } from '../tilgang/useTilgang.ts'

export function useNyOppgaveliste(): [boolean, (value?: boolean) => void] {
  const erPilot = useErPilot('oppgaveintegrasjon')
  const [state, setState] = useLocalState('nyOppgaveliste', erPilot)
  const { logNyOppgavelisteValgt, logGammelOppgavelisteValgt } = useUmami()
  return [
    state,
    (value) => {
      const newState = value ?? !state
      if (newState) {
        logNyOppgavelisteValgt()
      } else {
        logGammelOppgavelisteValgt()
      }
      setState(newState)
    },
  ]
}
