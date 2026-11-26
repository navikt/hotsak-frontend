import { Box } from '@navikt/ds-react'

import { Sidetittel } from '../felleskomponenter/Sidetittel.tsx'
import { OppgaveTildelt, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { intervalString } from '../utils/dato.ts'
import { type DefaultOppgaveColumns } from './oppgaveColumns.tsx'
import { OppgaveToolbarTab, useOppgavelisteContext } from './OppgavelisteContext.tsx'
import { OppgavelisteProvider } from './OppgavelisteProvider.tsx'
import { OppgaverTable } from './OppgaverTable.tsx'
import { selectIsUlest } from './oppgaveSelectors.ts'
import { OppgaveToolbar, type OppgaveToolbarProps } from './OppgaveToolbar.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'

export default function MineOppgaverWrapper() {
  return (
    <>
      <Sidetittel tittel="Mine oppgaver" />
      <OppgavelisteProvider suffix="Mine" defaultColumns={defaultColumns}>
        <MineOppgaver />
      </OppgavelisteProvider>
    </>
  )
}

function MineOppgaver() {
  const { currentTab } = useOppgavelisteContext()
  const ferdigstilte = currentTab === OppgaveToolbarTab.FERDIGSTILTE
  const åpneOppgaver = useClientSideOppgaver({
    statuskategori: Statuskategori.ÅPEN,
    tildelt: OppgaveTildelt.MEG,
  })
  const ferdigstilteOppgaver = useClientSideOppgaver({
    statuskategori: Statuskategori.AVSLUTTET,
    tildelt: OppgaveTildelt.MEG,
    ferdigstiltIntervall: intervalString({ days: ANTALL_DAGER_FERDIGSTILTE }, iDag),
  })
  const { oppgaver, filterOptions, filterCounts, isLoading, antallViste } = ferdigstilte
    ? ferdigstilteOppgaver
    : åpneOppgaver
  const toolbarProps: OppgaveToolbarProps = {
    antallOppgaver: åpneOppgaver.antallOppgaver,
    antallViste,
    antallHastesaker: åpneOppgaver.antallHastesaker,
    antallAktive: åpneOppgaver.antallAktive,
    antallPåVent: åpneOppgaver.antallPåVent,
    antallFerdigstilte: ferdigstilteOppgaver.antallOppgaver,
    ferdigstilte: true,
    loading: åpneOppgaver.isLoading || ferdigstilteOppgaver.isLoading,
  }
  return (
    <Box marginInline="space-20">
      <OppgaveToolbar {...toolbarProps} />
      <OppgaverTable
        oppgaver={oppgaver}
        filterOptions={filterOptions}
        filterCounts={filterCounts}
        loading={isLoading}
        isHighlighted={selectIsUlest}
      />
    </Box>
  )
}

const ANTALL_DAGER_FERDIGSTILTE = 10

const iDag = new Date()

const defaultColumns: DefaultOppgaveColumns = [
  'åpneOppgave',
  'nytt',
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
  ['brukerFnr', false],
  ['brukerNavn', false],
  ['brukerFødselsdato', false],
  'brukerAlder',
  'kommune',
  ['saksstatus', false],
  'opprettetTidspunkt',
  'fristDato',
  ['ferdigstiltTidspunkt', false],
  'mineOppgaverMenu',
]
