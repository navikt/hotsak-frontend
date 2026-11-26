import { Box } from '@navikt/ds-react'

import { Sidetittel } from '../felleskomponenter/Sidetittel.tsx'
import { OppgaveTildelt, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { type DefaultOppgaveColumns } from './oppgaveColumns.tsx'
import { OppgavelisteProvider } from './OppgavelisteProvider.tsx'
import { OppgaverTable } from './OppgaverTable.tsx'
import { OppgaveToolbar } from './OppgaveToolbar.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'

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

function EnhetensOppgaver() {
  const { oppgaver, filterOptions, filterCounts, isLoading, ...rest } = useClientSideOppgaver({
    statuskategori: Statuskategori.ÅPEN,
    tildelt: OppgaveTildelt.INGEN,
  })
  return (
    <Box marginInline="space-20">
      <OppgaveToolbar loading={isLoading} {...rest} />
      <OppgaverTable
        oppgaver={oppgaver}
        filterOptions={filterOptions}
        filterCounts={filterCounts}
        loading={isLoading}
      />
    </Box>
  )
}

const defaultColumns: DefaultOppgaveColumns = [
  'taOppgave',
  ['oppgaveId', false],
  ['sakId', false],
  'oppgavetype',
  'behandlingstema',
  'behandlingstype',
  'beskrivelse',
  'nøkkelord',
  'mappenavn',
  'prioritet',
  'innsenderNavn',
  'brukerFødselsdato',
  'brukerAlder',
  'kommune',
  ['saksstatus', false],
  'opprettetTidspunkt',
  'fristDato',
]
