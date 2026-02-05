import { DataGridFilterProvider } from '../../felleskomponenter/data/DataGridFilterProvider.tsx'
import { MedarbeidersOppgaver } from './MedarbeidersOppgaver.tsx'
import { type OppgaveColumnField } from './oppgaveColumns.tsx'
import { OppgaveColumnsProvider } from './OppgaveColumnsProvider.tsx'
import { OppgavePaginationProvider } from './OppgavePaginationProvider.tsx'

const SUFFIX = 'Medarbeiders'

export default function MineOppgaverWrapper() {
  return (
    <OppgaveColumnsProvider suffix={SUFFIX} defaultColumns={defaultColumns}>
      <OppgavePaginationProvider suffix={SUFFIX}>
        <DataGridFilterProvider suffix={SUFFIX}>
          <MedarbeidersOppgaver />
        </DataGridFilterProvider>
      </OppgavePaginationProvider>
    </OppgaveColumnsProvider>
  )
}

const defaultColumns: ReadonlyArray<OppgaveColumnField> = [
  'overtaOppgave',
  'saksbehandler',
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
