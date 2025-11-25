import { MineOppgaver } from './MineOppgaver.tsx'
import { OppgaveFilterProvider } from './OppgaveFilterProvider.tsx'

export default function MineOppgaverWrapper() {
  return (
    <OppgaveFilterProvider suffix="Mine">
      <MineOppgaver />
    </OppgaveFilterProvider>
  )
}
