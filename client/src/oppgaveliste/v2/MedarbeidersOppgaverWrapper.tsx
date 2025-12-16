import { MedarbeidersOppgaver } from './MedarbeidersOppgaver.tsx'
import { OppgavePaginationProvider } from './OppgavePaginationProvider.tsx'
import { DataGridFilterProvider } from '../../felleskomponenter/data/DataGridFilterProvider.tsx'

export default function MineOppgaverWrapper() {
  return (
    <OppgavePaginationProvider suffix="Medarbeiders">
      <DataGridFilterProvider>
        <MedarbeidersOppgaver />
      </DataGridFilterProvider>
    </OppgavePaginationProvider>
  )
}
