import { useNavigate } from 'react-router-dom'

import { useModia } from '../header/useModia.ts'
import { GLOBALE_HOTKEYS } from './hotkeys.ts'
import { useHotkey } from './useHotkey.ts'

export function useGlobaleHotkeys({ visHurtigtaster }: { visHurtigtaster: () => void }) {
  const navigate = useNavigate()
  const { åpneModia } = useModia()

  useHotkey(GLOBALE_HOTKEYS.åpneModia, åpneModia, { skipInInputFields: true })
  useHotkey(GLOBALE_HOTKEYS.åpneGosys, () => window.open(window.appSettings.GOSYS_OPPGAVEBEHANDLING_URL, 'gosys'), {
    skipInInputFields: true,
  })
  useHotkey(GLOBALE_HOTKEYS.visHurtigtaster, visHurtigtaster, { skipInInputFields: true })
  useHotkey(GLOBALE_HOTKEYS.mineOppgaver, () => navigate('/oppgaver/mine'), { skipInInputFields: true })
  useHotkey(GLOBALE_HOTKEYS.enhetensOppgaver, () => navigate('/oppgaver/enhetens'), { skipInInputFields: true })
  useHotkey(GLOBALE_HOTKEYS.medarbeidersOppgaver, () => navigate('/oppgaver/medarbeiders'), { skipInInputFields: true })
}
