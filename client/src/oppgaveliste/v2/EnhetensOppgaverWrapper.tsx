import { EnhetensOppgaver } from './EnhetensOppgaver.tsx'
import { OppgavePaginationProvider } from './OppgavePaginationProvider.tsx'
import { DataGridFilterProvider } from '../../felleskomponenter/data/DataGridFilterProvider.tsx'

export default function EnhetensOppgaverWrapper() {
  return (
    <OppgavePaginationProvider suffix="Enhetens">
      <DataGridFilterProvider>
        <EnhetensOppgaver />
      </DataGridFilterProvider>
    </OppgavePaginationProvider>
  )
}
