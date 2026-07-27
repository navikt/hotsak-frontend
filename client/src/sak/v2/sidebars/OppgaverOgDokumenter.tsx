import { PersonEnvelopeIcon } from '@navikt/aksel-icons'
import { useDokumentsøk } from '../../../dokument/useDokumentsøk'
import { DataGrid } from '../../../felleskomponenter/data/DataGrid'
import { Mellomtittel } from '../../../felleskomponenter/typografi'
import { Oppgave } from '../../../oppgave/oppgaveTypes'
import { useOpppgavesøk } from '../../../oppgave/useOppgavesøk'
import { oppgaveColumns } from '../../../oppgaveliste/oppgaveColumns'
import { selectOppgaveId } from '../../../oppgaveliste/oppgaveSelectors'
import { dokumentColumns, journalpostKey, journalposttypeTagKort } from '../../../personoversikt/dokumentColumns'
import { useSak } from '../../../saksbilde/useSak'
import { SidebarPanel, SidebarPanelBox, SidebarPanelHeading } from './SidebarPanel'

export function OppgaverOgDokumenter() {
  const { sak } = useSak()

  const ingenOppgaver: Oppgave[] = []
  const fnr = sak?.data.bruker.fnr
  const { journalposter, isLoading } = useDokumentsøk({ fnr })
  const oppgaverResponse = useOpppgavesøk({
    brukerId: fnr,
    sorteringsfelt: 'OPPRETTET_TIDSPUNKT',
    sorteringsrekkefølge: 'DESC',
    pageNumber: 1,
    pageSize: 5,
  })

  const alleOppgaver = oppgaverResponse.data?.oppgaver ?? ingenOppgaver

  const oppgaveCols = [
    oppgaveColumns.åpneOppgave,
    { ...oppgaveColumns.oppgavetype, filter: undefined },
    { ...oppgaveColumns.behandlingstema, filter: undefined },
    { ...oppgaveColumns.behandlingstype, filter: undefined },
    { ...oppgaveColumns.ferdigstiltTidspunkt },
  ]

  const dokuCols = [
    { ...dokumentColumns.journalpostId, width: 50, header: 'ID' },
    {
      ...dokumentColumns.journalposttype,
      width: 50,
      renderCell: ({ journalposttype }) => journalposttypeTagKort(journalposttype),
    },
    { ...dokumentColumns.journalpostOpprettetTid, formatDate: true, width: 100 },
    dokumentColumns.tittel,
    dokumentColumns.dokumenter,
    dokumentColumns.sakId,
  ]

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
      </SidebarPanel>
    </>
  )
}
