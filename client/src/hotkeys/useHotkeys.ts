import { useNavigate } from 'react-router-dom'

import { useModia } from '../header/useModia.ts'
import { HOTKEYS } from './hotkeys.ts'
import { useGlobalHotkey } from './useGlobalHotkey.ts'

export function useHotkeys({ visHurtigtaster }: { visHurtigtaster: () => void }) {
  const navigate = useNavigate()
  const { åpneModia } = useModia()

  useGlobalHotkey(HOTKEYS.åpneModia, åpneModia, { skipInInputFields: true })
  useGlobalHotkey(HOTKEYS.åpneGosys, () => window.open(window.appSettings.GOSYS_OPPGAVEBEHANDLING_URL, 'gosys'), {
    skipInInputFields: true,
  })
  useGlobalHotkey(HOTKEYS.visHurtigtaster, visHurtigtaster, { skipInInputFields: true })
  useGlobalHotkey(HOTKEYS.mineOppgaver, () => navigate('/mine'), { skipInInputFields: true })
  useGlobalHotkey(HOTKEYS.enhetensOppgaver, () => navigate('/enhetens'), { skipInInputFields: true })
  useGlobalHotkey(HOTKEYS.medarbeidersOppgaver, () => navigate('/medarbeiders'), { skipInInputFields: true })
}
