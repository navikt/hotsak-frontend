import { Box } from '@navikt/ds-react'

import { OppgaveTildelt } from '../../oppgave/oppgaveTypes.ts'
import { EnhetensOppgaverTable } from './EnhetensOppgaverTable.tsx'
import { type OppgaveColumnField } from './oppgaveColumns.tsx'
import { OppgaveColumnsProvider } from './OppgaveColumnsProvider.tsx'
import { OppgaveToolbar } from './OppgaveToolbar.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'

export function EnhetensOppgaver() {
  const { oppgaver, isLoading, totalElements, filterOptions } = useClientSideOppgaver(OppgaveTildelt.INGEN)
  return (
    <Box.New marginInline="5">
      <OppgaveColumnsProvider defaultColumns={defaultColumns}>
        <OppgaveToolbar text={`${oppgaver.length} av ${totalElements} oppgaver`} />
        <EnhetensOppgaverTable oppgaver={oppgaver} filterOptions={filterOptions} loading={isLoading} />
      </OppgaveColumnsProvider>
    </Box.New>
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
  'kommune',
]
