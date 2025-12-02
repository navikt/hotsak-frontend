import { MedarbeidersOppgaver } from './MedarbeidersOppgaver.tsx'
import { OppgaveFilterProvider } from './OppgaveFilterProvider.tsx'

export default function MineOppgaverWrapper() {
  return (
    <OppgaveFilterProvider suffix="Medarbeiders">
      <MedarbeidersOppgaver />
    </OppgaveFilterProvider>
  )
}
