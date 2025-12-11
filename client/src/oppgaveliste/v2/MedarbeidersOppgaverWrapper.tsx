import { MedarbeidersOppgaver } from './MedarbeidersOppgaver.tsx'
import { OppgaveFilterProvider } from './OppgaveFilterProvider.tsx'
import { DataGridFilterProvider } from '../../felleskomponenter/data/DataGridFilterProvider.tsx'

export default function MineOppgaverWrapper() {
  return (
    <OppgaveFilterProvider suffix="Medarbeiders">
      <DataGridFilterProvider>
        <MedarbeidersOppgaver />
      </DataGridFilterProvider>
    </OppgaveFilterProvider>
  )
}
