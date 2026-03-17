import { useLocalState } from '../../state/useLocalState.ts'
import { useErPilot } from '../../tilgang/useTilgang.ts'
import { useMiljø } from '../../utils/useMiljø.ts'

export function useNyttSaksbilde(): [boolean, (verdi: boolean) => void] {
  const { erProd } = useMiljø()
  const [nyttSaksbildeToggle, setNyttSaksbildeToggle] = useLocalState('nyttSaksbilde', false)
  const erNyttSaksbildePilot = useErPilot('nyttSaksbilde')

  if (erProd) {
    return [erNyttSaksbildePilot, () => {}]
  } else {
    return [nyttSaksbildeToggle, setNyttSaksbildeToggle]
  }
}
