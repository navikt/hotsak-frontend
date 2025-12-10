import { Box } from '@navikt/ds-react'

import { OppgaveTildelt } from '../../oppgave/oppgaveTypes.ts'
import { MineOppgaverTable } from './MineOppgaverTable.tsx'
import { type OppgaveColumn } from './oppgaveColumns.tsx'
import { OppgaveColumnsProvider } from './OppgaveColumnsProvider.tsx'
import { OppgaveToolbar } from './OppgaveToolbar.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'

export function MineOppgaver() {
  const { oppgaver, isLoading } = useClientSideOppgaver(OppgaveTildelt.MEG)
  return (
    <Box.New marginInline="5">
      <OppgaveColumnsProvider defaultColumns={defaultColumns}>
        <OppgaveToolbar />
        <MineOppgaverTable oppgaver={oppgaver} loading={isLoading} />
      </OppgaveColumnsProvider>
    </Box.New>
  )
}

const defaultColumns: OppgaveColumn[] = [
  {
    key: 'oppgavetype',
    checked: true,
    order: 0,
  },
  {
    key: 'behandlingstema',
    checked: true,
    order: 1,
  },
  {
    key: 'behandlingstype',
    checked: true,
    order: 2,
  },
  {
    key: 'beskrivelse',
    checked: true,
    order: 3,
  },
  {
    key: 'mappenavn',
    checked: true,
    order: 4,
  },
  {
    key: 'prioritet',
    checked: true,
    order: 5,
  },
  {
    key: 'opprettetTidspunkt',
    checked: true,
    order: 6,
  },
  {
    key: 'fristFerdigstillelse',
    checked: true,
    order: 7,
  },
  {
    key: 'bruker',
    checked: true,
    order: 8,
  },
  {
    key: 'kommune',
    checked: true,
    order: 9,
  },
]
