import { useLocalState } from '../../state/useLocalState.ts'
import { useErPilot } from '../../tilgang/useTilgang.ts'
import { useMiljø } from '../../utils/useMiljø.ts'

export function useNyttSaksbilde(): [boolean, (verdi: boolean) => void] {
  const { erProd } = useMiljø()
  const [nyttSaksbildeToggle, setNyttSaksbildeToggle] = useLocalState('nyttSaksbilde', false)
  const erNyttSaksbildePilot = useErPilot('nyttSaksbilde')

  if (erProd) {
    console.log(
      `Bryr oss ikke om localStorage,sjekker om nytt saksbilde skal vises. Er bruker er i pilot: ',
      ${erNyttSaksbildePilot}`
    )
    return [erNyttSaksbildePilot, () => {}]
  } else {
    console.log(`Sjekker om nytt saksbilde skal vises basert på toogle i local storage: ${nyttSaksbildeToggle}`)
    return [nyttSaksbildeToggle, setNyttSaksbildeToggle]
  }
}
