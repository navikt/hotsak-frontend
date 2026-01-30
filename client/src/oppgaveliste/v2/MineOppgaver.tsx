import { Box, Switch } from '@navikt/ds-react'
import { useState } from 'react'

import { OppgaveTildelt, Statuskategori } from '../../oppgave/oppgaveTypes.ts'
import { MineOppgaverTable } from './MineOppgaverTable.tsx'
import { type OppgaveColumnField } from './oppgaveColumns.tsx'
import { OppgaveColumnsProvider } from './OppgaveColumnsProvider.tsx'
import { OppgaveToolbar } from './OppgaveToolbar.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'
import { useOppgavemetrikker } from './useOppgavemetrikker.ts'

export function MineOppgaver() {
  useOppgavemetrikker()
  const [visFerdigstilte, setVisFerdigstilte] = useState(false)
  const { oppgaver, isLoading, totalElements, filterOptions } = useClientSideOppgaver({
    statuskategori: visFerdigstilte ? Statuskategori.AVSLUTTET : Statuskategori.ÅPEN,
    tildelt: OppgaveTildelt.MEG,
  })
  return (
    <Box.New marginInline="5">
      <OppgaveColumnsProvider suffix="Mine" defaultColumns={defaultColumns}>
        <OppgaveToolbar text={`${oppgaver.length} av ${totalElements} oppgaver`}>
          <Switch
            checked={visFerdigstilte}
            onChange={(event) => {
              setVisFerdigstilte(event.target.checked)
            }}
            size="small"
          >
            Ferdigstilte
          </Switch>
        </OppgaveToolbar>
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
  'brukerAlder',
  'innsenderNavn',
  'kommune',
  'mineOppgaverMenu',
]
