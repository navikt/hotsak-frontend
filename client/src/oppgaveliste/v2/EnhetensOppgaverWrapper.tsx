import { EnhetensOppgaver } from './EnhetensOppgaver.tsx'
import { OppgaveFilterProvider } from './OppgaveFilterProvider.tsx'
import { DataGridFilterProvider } from '../../felleskomponenter/data/DataGridFilterProvider.tsx'

export default function EnhetensOppgaverWrapper() {
  return (
    <OppgaveFilterProvider suffix="Enhetens">
      <DataGridFilterProvider>
        <EnhetensOppgaver />
      </DataGridFilterProvider>
    </OppgaveFilterProvider>
  )
}
