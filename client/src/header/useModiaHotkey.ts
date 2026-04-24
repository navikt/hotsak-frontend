import { GLOBALE_HOTKEYS } from '../hotkeys/hotkeys.ts'
import { useHotkey } from '../hotkeys/useHotkey.ts'
import { useModia } from './useModia.ts'

export function useModiaHotkey() {
  const { åpneModia } = useModia()
  useHotkey(GLOBALE_HOTKEYS.åpneModia, åpneModia)
}
