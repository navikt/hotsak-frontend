import { useMatch } from 'react-router-dom'
import { useDataGridFilterResetAllHandler } from '../felleskomponenter/data/DataGridFilterContext.ts'
import { OPPGAVELISTE_HOTKEYS } from '../hotkeys/hotkeys.ts'
import { useHotkey } from '../hotkeys/useHotkey.ts'
import { OppgaveToolbarTab, useOppgavelisteContext, useOppgavelisteTabChangeHandler } from './OppgavelisteContext.tsx'

export function useOppgavelisteHotkeys() {
  const { currentTab } = useOppgavelisteContext()
  const handleTabChanged = useOppgavelisteTabChangeHandler()
  const handleFilterResetAll = useDataGridFilterResetAllHandler(currentTab)
  const erPåMineOppgaver = !!useMatch('/oppgaver/mine')

  useHotkey(OPPGAVELISTE_HOTKEYS.alle, () => handleTabChanged(OppgaveToolbarTab.ALLE), {})
  useHotkey(OPPGAVELISTE_HOTKEYS.hast, () => handleTabChanged(OppgaveToolbarTab.HASTESAKER), {})
  useHotkey(OPPGAVELISTE_HOTKEYS.venter, () => handleTabChanged(OppgaveToolbarTab.PÅ_VENT), {})
  useHotkey(OPPGAVELISTE_HOTKEYS.ferdigstilte, () => handleTabChanged(OppgaveToolbarTab.FERDIGSTILTE), {
    enabled: erPåMineOppgaver,
  })
  useHotkey(OPPGAVELISTE_HOTKEYS.fjernAlleFiltre, handleFilterResetAll, {})
}
