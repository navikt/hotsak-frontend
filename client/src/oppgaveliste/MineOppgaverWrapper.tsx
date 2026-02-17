import { DataGridFilterProvider } from '../felleskomponenter/data/DataGridFilterProvider.tsx'
import { MineOppgaver } from './MineOppgaver.tsx'
import { type DefaultOppgaveColumns } from './oppgaveColumns.tsx'
import { OppgaveColumnsProvider } from './OppgaveColumnsProvider.tsx'
import { OppgavePaginationProvider } from './OppgavePaginationProvider.tsx'

const SUFFIX = 'Mine'

export default function MineOppgaverWrapper() {
  return (
    <OppgaveColumnsProvider suffix={SUFFIX} defaultColumns={defaultColumns}>
      <OppgavePaginationProvider suffix={SUFFIX}>
        <DataGridFilterProvider suffix={SUFFIX}>
          <MineOppgaver />
        </DataGridFilterProvider>
      </OppgavePaginationProvider>
    </OppgaveColumnsProvider>
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
  'opprettetTidspunkt',
  'fristFerdigstillelse',
  ['ferdigstiltTidspunkt', false],
  'mineOppgaverMenu',
]
