import { useDataGridFilterResetAllHandler } from '../felleskomponenter/data/DataGridFilterContext.ts'
import { OPPGAVELISTE_HOTKEYS } from '../hotkeys/hotkeys.ts'
import { useHotkey } from '../hotkeys/useHotkey.ts'
import { useMiljø } from '../utils/useMiljø.ts'
import { OppgaveToolbarTab, useOppgavelisteContext, useOppgavelisteTabChangeHandler } from './OppgavelisteContext.tsx'

export function useOppgavelisteHotkeys() {
  const { erIkkeProd } = useMiljø()
  const { currentTab } = useOppgavelisteContext()
  const handleTabChanged = useOppgavelisteTabChangeHandler()
  const handleFilterResetAll = useDataGridFilterResetAllHandler(currentTab)

  useHotkey(OPPGAVELISTE_HOTKEYS.alle, () => handleTabChanged(OppgaveToolbarTab.ALLE), {
    enabled: erIkkeProd,
    skipInInputFields: true,
  })
  useHotkey(OPPGAVELISTE_HOTKEYS.hast, () => handleTabChanged(OppgaveToolbarTab.HASTESAKER), {
    enabled: erIkkeProd,
    skipInInputFields: true,
  })
  useHotkey(OPPGAVELISTE_HOTKEYS.venter, () => handleTabChanged(OppgaveToolbarTab.PÅ_VENT), {
    enabled: erIkkeProd,
    skipInInputFields: true,
  })
  useHotkey(OPPGAVELISTE_HOTKEYS.ferdigstilte, () => handleTabChanged(OppgaveToolbarTab.FERDIGSTILTE), {
    enabled: erIkkeProd,
  })
  useHotkey(OPPGAVELISTE_HOTKEYS.fjernAlleFiltre, handleFilterResetAll, {
    enabled: erIkkeProd,
    skipInInputFields: true,
  })
}
