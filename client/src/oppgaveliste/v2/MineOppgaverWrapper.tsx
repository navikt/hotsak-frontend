import { MineOppgaver } from './MineOppgaver.tsx'
import { OppgavePaginationProvider } from './OppgavePaginationProvider.tsx'
import { DataGridFilterProvider } from '../../felleskomponenter/data/DataGridFilterProvider.tsx'

export default function MineOppgaverWrapper() {
  return (
    <OppgavePaginationProvider suffix="Mine">
      <DataGridFilterProvider>
        <MineOppgaver />
      </DataGridFilterProvider>
    </OppgavePaginationProvider>
  )
}
