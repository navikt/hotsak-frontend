import { useModia } from '../header/useModia.ts'
import { HOTKEYS } from './hotkeys.ts'
import { useGlobalHotkey } from './useGlobalHotkey.ts'

export function useHotkeys() {
  const { åpneModia } = useModia()

  useGlobalHotkey(HOTKEYS.åpneModia, åpneModia)
  useGlobalHotkey(HOTKEYS.åpneGosys, () => window.open(window.appSettings.GOSYS_OPPGAVEBEHANDLING_URL, 'gosys'))
}
