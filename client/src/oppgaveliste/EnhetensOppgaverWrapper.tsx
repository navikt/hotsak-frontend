import { EnhetensOppgaver } from './EnhetensOppgaver.tsx'
import { type DefaultOppgaveColumns } from './oppgaveColumns.tsx'
import { OppgavelisteProvider } from './OppgavelisteProvider.tsx'
import { Sidetittel } from '../felleskomponenter/Sidetittel.tsx'

export default function EnhetensOppgaverWrapper() {
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
