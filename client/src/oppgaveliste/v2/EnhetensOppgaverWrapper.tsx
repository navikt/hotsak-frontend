import { DataGridFilterProvider } from '../../felleskomponenter/data/DataGridFilterProvider.tsx'
import { EnhetensOppgaver } from './EnhetensOppgaver.tsx'
import { type OppgaveColumnField } from './oppgaveColumns.tsx'
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

const defaultColumns: ReadonlyArray<OppgaveColumnField> = [
  'taOppgave',
  'oppgavetype',
  'behandlingstema',
  'behandlingstype',
  'beskrivelse',
  'mappenavn',
  'prioritet',
  'opprettetTidspunkt',
  'fristFerdigstillelse',
  'brukerFnr',
  'brukerNavn',
  'brukerAlder',
  'innsenderNavn',
  'kommune',
]
