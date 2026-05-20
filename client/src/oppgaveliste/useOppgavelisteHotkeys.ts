import { useDataGridFilterResetAllHandler } from '../felleskomponenter/data/DataGridFilterContext.ts'
import { OPPGAVELISTE_HOTKEYS } from '../hotkeys/hotkeys.ts'
import { useHotkey } from '../hotkeys/useHotkey.ts'
import { useErPilot } from '../tilgang/useTilgang.ts'
import { OppgaveToolbarTab, useOppgavelisteContext, useOppgavelisteTabChangeHandler } from './OppgavelisteContext.tsx'

export function useOppgavelisteHotkeys() {
  const erHotsakEksperimenter = useErPilot('hotsakEksperimenter')
  const { currentTab } = useOppgavelisteContext()
  const handleTabChanged = useOppgavelisteTabChangeHandler()
  const handleFilterResetAll = useDataGridFilterResetAllHandler(currentTab)

  useHotkey(OPPGAVELISTE_HOTKEYS.alle, () => handleTabChanged(OppgaveToolbarTab.ALLE), {
    enabled: erHotsakEksperimenter,
    skipInInputFields: true,
  })
  useHotkey(OPPGAVELISTE_HOTKEYS.hast, () => handleTabChanged(OppgaveToolbarTab.HASTESAKER), {
    enabled: erHotsakEksperimenter,
    skipInInputFields: true,
  })
  useHotkey(OPPGAVELISTE_HOTKEYS.venter, () => handleTabChanged(OppgaveToolbarTab.PÅ_VENT), {
    enabled: erHotsakEksperimenter,
    skipInInputFields: true,
  })
  // TODO Ikke ferdigstilte hurtigtast i alle tabs
  useHotkey(OPPGAVELISTE_HOTKEYS.ferdigstilte, () => handleTabChanged(OppgaveToolbarTab.FERDIGSTILTE), {
    enabled: erHotsakEksperimenter,
  })
  useHotkey(OPPGAVELISTE_HOTKEYS.fjernAlleFiltre, handleFilterResetAll, {
    enabled: erHotsakEksperimenter,
    skipInInputFields: true,
  })
}
