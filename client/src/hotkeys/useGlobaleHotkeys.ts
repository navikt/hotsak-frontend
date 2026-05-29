import { useNavigate } from 'react-router-dom'

import { useModia } from '../header/useModia.ts'
import { GLOBALE_HOTKEYS } from './hotkeys.ts'
import { useHotkey } from './useHotkey.ts'

export function useGlobaleHotkeys({ visHurtigtaster }: { visHurtigtaster: () => void }) {
  const navigate = useNavigate()
  const { åpneModia } = useModia()

  useHotkey(GLOBALE_HOTKEYS.åpneModia, åpneModia, { skipInInputFields: true, enabled: true })
  useHotkey(GLOBALE_HOTKEYS.visHurtigtaster, visHurtigtaster, {})
  useHotkey(GLOBALE_HOTKEYS.mineOppgaver, () => navigate('/oppgaver/mine'), {})
  useHotkey(GLOBALE_HOTKEYS.enhetensOppgaver, () => navigate('/oppgaver/enhetens'), {})
  useHotkey(GLOBALE_HOTKEYS.medarbeidersOppgaver, () => navigate('/oppgaver/medarbeiders'), {})
}
