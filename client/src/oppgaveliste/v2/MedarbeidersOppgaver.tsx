import { Box } from '@navikt/ds-react'

import { OppgaveTildelt } from '../../oppgave/oppgaveTypes.ts'
import { MedarbeidersOppgaverTable } from './MedarbeidersOppgaverTable.tsx'
import { type OppgaveColumnField } from './oppgaveColumns.tsx'
import { OppgaveColumnsProvider } from './OppgaveColumnsProvider.tsx'
import { OppgaveToolbar } from './OppgaveToolbar.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'

export function MedarbeidersOppgaver() {
  const { oppgaver, isLoading, totalElements, filterOptions } = useClientSideOppgaver(OppgaveTildelt.MEDARBEIDER)
  return (
    <Box.New marginInline="5">
      <OppgaveColumnsProvider suffix="Medarbeiders" defaultColumns={defaultColumns}>
        <OppgaveToolbar text={`${oppgaver.length} av ${totalElements} oppgaver`} />
        <MedarbeidersOppgaverTable oppgaver={oppgaver} filterOptions={filterOptions} loading={isLoading} />
      </OppgaveColumnsProvider>
    </Box.New>
  )
}

const defaultColumns: ReadonlyArray<OppgaveColumnField> = [
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
  'medarbeidersOppgaverMenu',
]
