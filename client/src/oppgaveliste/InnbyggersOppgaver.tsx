import { Box } from '@navikt/ds-react'

import { Sidetittel } from '../felleskomponenter/Sidetittel.tsx'
import { Statuskategori } from '../oppgave/oppgaveTypes.ts'
import type { DefaultOppgaveColumns } from './oppgaveColumns.tsx'
import { OppgaveToolbarTab, useOppgavelisteContext } from './OppgavelisteContext.tsx'
import { OppgavelisteProvider } from './OppgavelisteProvider.tsx'
import { OppgaverTable } from './OppgaverTable.tsx'
import { OppgaveToolbar, type OppgaveToolbarProps } from './OppgaveToolbar.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'

export default function InnbyggersOppgaverWrapper({ fnr }: { fnr: string }) {
  return (
    <>
      <Sidetittel tittel="Innbyggers oppgaver" />
      <OppgavelisteProvider suffix="Innbyggers" defaultColumns={defaultColumns}>
        <InnbyggersOppgaver brukerId={fnr} />
      </OppgavelisteProvider>
    </>
  )
}

function InnbyggersOppgaver({ brukerId }: { brukerId: string }) {
  const { currentTab } = useOppgavelisteContext()
  const ferdigstilte = currentTab === OppgaveToolbarTab.FERDIGSTILTE
  const åpneOppgaver = useClientSideOppgaver({
    statuskategori: Statuskategori.ÅPEN,
    brukerId,
  })
  const ferdigstilteOppgaver = useClientSideOppgaver({
    statuskategori: Statuskategori.AVSLUTTET,
    brukerId,
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
    <Box>
      <OppgaveToolbar {...toolbarProps} />
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
  ['saksstatus', false],
  'opprettetTidspunkt',
  'fristDato',
  ['ferdigstiltTidspunkt', false],
]
