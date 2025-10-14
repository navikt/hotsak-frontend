import { EnhetensOppgaver } from './EnhetensOppgaver.tsx'
import { OppgaveFilterProvider } from './OppgaveFilterProvider.tsx'

export default function EnhetensOppgaverWrapper() {
  return (
    <OppgaveFilterProvider prefix="kø">
      <EnhetensOppgaver />
    </OppgaveFilterProvider>
  )
}
