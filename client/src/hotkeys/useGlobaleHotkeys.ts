import { useNavigate } from 'react-router-dom'

import { useModia } from '../header/useModia.ts'
import { GLOBALE_HOTKEYS } from './hotkeys.ts'
import { useHotkey } from './useHotkey.ts'
import { useErPilot } from '../tilgang/useTilgang.ts'

export function useGlobaleHotkeys({ visHurtigtaster }: { visHurtigtaster: () => void }) {
  const navigate = useNavigate()
  const { åpneModia } = useModia()
  const erHotsakEksperimenter = useErPilot('hotsakEksperimenter')

  useHotkey(GLOBALE_HOTKEYS.åpneModia, åpneModia, { skipInInputFields: true, enabled: erHotsakEksperimenter })
  useHotkey(GLOBALE_HOTKEYS.åpneGosys, () => window.open(window.appSettings.GOSYS_OPPGAVEBEHANDLING_URL, 'gosys'), {
    skipInInputFields: true,
    enabled: erHotsakEksperimenter,
  })
  useHotkey(GLOBALE_HOTKEYS.visHurtigtaster, visHurtigtaster, {
    skipInInputFields: true,
    enabled: erHotsakEksperimenter,
  })
  useHotkey(GLOBALE_HOTKEYS.mineOppgaver, () => navigate('/oppgaver/mine'), {
    skipInInputFields: true,
    enabled: erHotsakEksperimenter,
  })
  useHotkey(GLOBALE_HOTKEYS.enhetensOppgaver, () => navigate('/oppgaver/enhetens'), {
    skipInInputFields: true,
    enabled: erHotsakEksperimenter,
  })
  useHotkey(GLOBALE_HOTKEYS.medarbeidersOppgaver, () => navigate('/oppgaver/medarbeiders'), {
    skipInInputFields: true,
    enabled: erHotsakEksperimenter,
  })
}
