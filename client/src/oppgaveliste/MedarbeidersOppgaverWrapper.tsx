import { MedarbeidersOppgaver } from './MedarbeidersOppgaver.tsx'
import { type DefaultOppgaveColumns } from './oppgaveColumns.tsx'
import { OppgavelisteProvider } from './OppgavelisteProvider.tsx'

export default function MineOppgaverWrapper() {
  return (
    <OppgavelisteProvider suffix="Medarbeiders" defaultColumns={defaultColumns}>
      <MedarbeidersOppgaver />
    </OppgavelisteProvider>
  )
}

const defaultColumns: DefaultOppgaveColumns = [
  'overtaOppgave',
  'saksbehandler',
  'oppgavetype',
  'behandlingstema',
  'behandlingstype',
  'beskrivelse',
  'mappenavn',
  'prioritet',
  'innsenderNavn',
  'brukerFødselsdato',
  'brukerAlder',
  'kommune',
  ['saksstatus', false],
  'opprettetTidspunkt',
  'fristFerdigstillelse',
]
