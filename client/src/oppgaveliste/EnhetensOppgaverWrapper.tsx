import { Sidetittel } from '../felleskomponenter/Sidetittel.tsx'
import { useOppgavehendelserForEnhet } from '../oppgave/useOppgavehendelser.ts'
import { EnhetensOppgaver } from './EnhetensOppgaver.tsx'
import { type DefaultOppgaveColumns } from './oppgaveColumns.tsx'
import { OppgavelisteProvider } from './OppgavelisteProvider.tsx'

export default function EnhetensOppgaverWrapper() {
  useOppgavehendelserForEnhet()
  return (
    <>
      <Sidetittel tittel="Enhetens oppgaver" />
      <OppgavelisteProvider suffix="Enhetens" defaultColumns={defaultColumns}>
        <EnhetensOppgaver />
      </OppgavelisteProvider>
    </>
  )
}

const defaultColumns: DefaultOppgaveColumns = [
  'taOppgave',
  ['oppgaveId', false],
  ['sakId', false],
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
