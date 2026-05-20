import { GLOBALE_HOTKEYS } from '../hotkeys/hotkeys.ts'
import { useHotkey } from '../hotkeys/useHotkey.ts'
import { useErPilot } from '../tilgang/useTilgang.ts'
import { useModia } from './useModia.ts'

export function useModiaHotkey() {
  const { åpneModia } = useModia()
  const erHotsakEksperimenter = useErPilot('hotsakEksperimenter')
  useHotkey(GLOBALE_HOTKEYS.åpneModia, åpneModia, { skipInInputFields: true, enabled: erHotsakEksperimenter })
}
