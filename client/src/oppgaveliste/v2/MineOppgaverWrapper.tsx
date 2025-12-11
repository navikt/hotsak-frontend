import { MineOppgaver } from './MineOppgaver.tsx'
import { OppgaveFilterProvider } from './OppgaveFilterProvider.tsx'
import { DataGridFilterProvider } from '../../felleskomponenter/data/DataGridFilterProvider.tsx'

export default function MineOppgaverWrapper() {
  return (
    <OppgaveFilterProvider suffix="Mine">
      <DataGridFilterProvider>
        <MineOppgaver />
      </DataGridFilterProvider>
    </OppgaveFilterProvider>
  )
}
