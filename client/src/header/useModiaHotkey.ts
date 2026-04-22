import { HOTKEYS } from '../hotkeys/hotkeys.ts'
import { useGlobalHotkey } from '../hotkeys/useGlobalHotkey.ts'
import { useModia } from './useModia.ts'

export function useModiaHotkey() {
  const { åpneModia } = useModia()
  useGlobalHotkey(HOTKEYS.åpneModia, åpneModia)
}
