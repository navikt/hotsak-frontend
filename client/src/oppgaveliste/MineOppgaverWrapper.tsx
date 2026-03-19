import { MineOppgaver } from './MineOppgaver.tsx'
import { type DefaultOppgaveColumns } from './oppgaveColumns.tsx'
import { OppgavelisteProvider } from './OppgavelisteProvider.tsx'

export default function MineOppgaverWrapper() {
  return (
    <OppgavelisteProvider suffix="Mine" defaultColumns={defaultColumns}>
      <MineOppgaver />
    </OppgavelisteProvider>
  )
}

const defaultColumns: DefaultOppgaveColumns = [
  'åpneOppgave',
  'oppgavetype',
  'behandlingstema',
  'behandlingstype',
  'beskrivelse',
  'mappenavn',
  'prioritet',
  'innsenderNavn',
  ['brukerFnr', false],
  ['brukerNavn', false],
  ['brukerFødselsdato', false],
  'brukerAlder',
  'kommune',
  ['saksstatus', false],
  'opprettetTidspunkt',
  'fristFerdigstillelse',
  ['ferdigstiltTidspunkt', false],
  'mineOppgaverMenu',
]
