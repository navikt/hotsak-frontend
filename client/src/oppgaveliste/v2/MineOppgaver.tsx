import { Box } from '@navikt/ds-react'

import { OppgaveTildelt } from '../../oppgave/oppgaveTypes.ts'
import { MineOppgaverTable } from './MineOppgaverTable.tsx'
import { type OppgaveColumnField } from './oppgaveColumns.tsx'
import { OppgaveColumnsProvider } from './OppgaveColumnsProvider.tsx'
import { OppgaveToolbar } from './OppgaveToolbar.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'

export function MineOppgaver() {
  const { oppgaver, isLoading, totalElements, filterOptions } = useClientSideOppgaver(OppgaveTildelt.MEG)
  return (
    <Box.New marginInline="5">
      <OppgaveColumnsProvider suffix="Mine" defaultColumns={defaultColumns}>
        <OppgaveToolbar text={`${oppgaver.length} av ${totalElements} oppgaver`} />
        <MineOppgaverTable oppgaver={oppgaver} filterOptions={filterOptions} loading={isLoading} />
      </OppgaveColumnsProvider>
    </Box.New>
  )
}

const defaultColumns: ReadonlyArray<OppgaveColumnField> = [
  'åpneOppgave',
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
  'kommune',
]
