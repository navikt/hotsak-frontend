import { ChevronLeftIcon, ChevronRightIcon, PersonEnvelopeIcon } from '@navikt/aksel-icons'
import { BodyShort, Button, HStack } from '@navikt/ds-react'
import { useState } from 'react'
import { useDokumentsøk } from '../../../dokument/useDokumentsøk'
import { DataGrid } from '../../../felleskomponenter/data/DataGrid'
import { Mellomtittel } from '../../../felleskomponenter/typografi'
import { Oppgave } from '../../../oppgave/oppgaveTypes'
import { useOpppgavesøk } from '../../../oppgave/useOppgavesøk'
import { oppgaveColumns } from '../../../oppgaveliste/oppgaveColumns'
import { selectOppgaveId } from '../../../oppgaveliste/oppgaveSelectors'
import {
  dokumentColumns,
  journalpostKey,
  journalpoststatusTagKort,
  journalposttypeTagKort,
} from '../../../personoversikt/dokumentColumns'
import { useSak } from '../../../saksbilde/useSak'
import { Journalpost } from '../../../types/types.internal'
import { SidebarPanel, SidebarPanelBox, SidebarPanelHeading } from './SidebarPanel'

const ingenOppgaver: Oppgave[] = []

const oppgaveCols = [
  oppgaveColumns.åpneOppgave,
  { ...oppgaveColumns.oppgavetype, filter: undefined },
  { ...oppgaveColumns.behandlingstema, filter: undefined },
  { ...oppgaveColumns.behandlingstype, filter: undefined },
  { ...oppgaveColumns.ferdigstiltTidspunkt, sortKey: undefined },
  { ...oppgaveColumns.saksbehandlerKort },
]

const dokuCols = [
  { ...dokumentColumns.journalpostId, width: 50, header: 'ID' },
  {
    ...dokumentColumns.journalposttype,
    width: 50,
    renderCell: ({ journalposttype }: Journalpost) => journalposttypeTagKort(journalposttype),
  },
  { ...dokumentColumns.journalpostOpprettetTid, formatDate: true, width: 100 },
  dokumentColumns.tittel,
  dokumentColumns.dokumenter,
  {
    ...dokumentColumns.journalstatus,
    width: 50,
    renderCell: ({ journalstatus }: Journalpost) => journalpoststatusTagKort(journalstatus),
  },
  dokumentColumns.sakId,
]

export function OppgaverOgDokumenter() {
  const { sak } = useSak()

  const fnr = sak?.data.bruker.fnr
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null])
  const etter = cursorHistory[cursorHistory.length - 1]
  const { journalposter, isLoading, sideInfo } = useDokumentsøk({ fnr, første: 5, etter: etter })
  const oppgaverResponse = useOpppgavesøk({
    brukerId: fnr,
    sorteringsfelt: 'OPPRETTET_TIDSPUNKT',
    sorteringsrekkefølge: 'DESC',
    pageNumber: 1,
    pageSize: 5,
  })

  const alleOppgaver = oppgaverResponse.data?.oppgaver ?? ingenOppgaver

  const nesteSide = () => {
    if (sideInfo?.finnesNesteSide && sideInfo.sluttpeker) {
      setCursorHistory((prev) => [...prev, sideInfo.sluttpeker])
    }
  }

  const forrigeSide = () => {
    setCursorHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }

  const sidenummer = cursorHistory.length
  const harForrigeSide = cursorHistory.length > 1
  const harNesteSide = sideInfo?.finnesNesteSide ?? false

  if (!sak) return null

  return (
    <>
      <SidebarPanelBox paddingBlock={'space-8 space-0'}>
        <SidebarPanelHeading
          tittel="Oppgaver og dokumenter"
          icon={<PersonEnvelopeIcon title="Oppgaver og dokumenter" />}
        />
      </SidebarPanelBox>

      <SidebarPanel
        tittel={<Mellomtittel>Oppgaver</Mellomtittel>}
        error={oppgaverResponse.error && 'Feil ved henting av oppgaver.'}
        loading={oppgaverResponse.isLoading && 'Henter oppgaver ...'}
        spacing={false}
        paddingBlock="space-16"
      >
        <DataGrid
          rows={alleOppgaver}
          columns={oppgaveCols}
          keyFactory={selectOppgaveId}
          size="small"
          textSize="small"
          loading={oppgaverResponse.isLoading}
        />
      </SidebarPanel>
      <SidebarPanel tittel={<Mellomtittel>Dokumenter</Mellomtittel>} spacing={false}>
        <DataGrid
          rows={journalposter}
          columns={dokuCols}
          keyFactory={journalpostKey}
          size="small"
          textSize="small"
          loading={isLoading}
        />
        <HStack gap="space-8" align="center" justify="center" paddingBlock="space-8">
          <Button
            size="small"
            variant="tertiary"
            icon={<ChevronLeftIcon />}
            onClick={forrigeSide}
            disabled={!harForrigeSide}
          >
            Forrige
          </Button>
          <BodyShort size="small">Side {sidenummer}</BodyShort>
          <Button
            size="small"
            variant="tertiary"
            icon={<ChevronRightIcon />}
            iconPosition="right"
            onClick={nesteSide}
            disabled={!harNesteSide}
          >
            Neste
          </Button>
        </HStack>
      </SidebarPanel>
    </>
  )
}
