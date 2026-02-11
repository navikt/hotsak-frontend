import { DataGridFilterProvider } from '../../felleskomponenter/data/DataGridFilterProvider.tsx'
import { EnhetensOppgaver } from './EnhetensOppgaver.tsx'
import { type DefaultOppgaveColumns } from './oppgaveColumns.tsx'
import { OppgaveColumnsProvider } from './OppgaveColumnsProvider.tsx'
import { OppgavePaginationProvider } from './OppgavePaginationProvider.tsx'

const SUFFIX = 'Enhetens'

export default function EnhetensOppgaverWrapper() {
  return (
    <OppgaveColumnsProvider suffix={SUFFIX} defaultColumns={defaultColumns}>
      <OppgavePaginationProvider suffix={SUFFIX}>
        <DataGridFilterProvider suffix={SUFFIX}>
          <EnhetensOppgaver />
        </DataGridFilterProvider>
      </OppgavePaginationProvider>
    </OppgaveColumnsProvider>
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
  'opprettetTidspunkt',
  'fristFerdigstillelse',
]
