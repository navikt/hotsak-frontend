import { HOTKEYS } from './hotkeys.ts'
import { useGlobalHotkey } from './useGlobalHotkey.ts'
import { useÅpneModia } from '../header/useÅpneModia.ts'

export function useHotkeys() {
  const { åpneModia } = useÅpneModia()

  useGlobalHotkey(HOTKEYS.åpneModia, åpneModia)
  useGlobalHotkey(HOTKEYS.åpneGosys, () => window.open(window.appSettings.GOSYS_OPPGAVEBEHANDLING_URL, 'gosys'))
}
