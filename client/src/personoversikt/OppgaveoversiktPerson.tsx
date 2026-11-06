import { DataGrid } from '../felleskomponenter/data/DataGrid.tsx'
import { useDataGridFilterContext } from '../felleskomponenter/data/DataGridFilterContext.ts'
import { usePageRequest } from '../felleskomponenter/Page.ts'
import { useOppgavesøk } from '../oppgave/useOppgavesøk.ts'
import { oppgaveColumns } from '../oppgaveliste/oppgaveColumns.tsx'
import { selectOppgaveId } from '../oppgaveliste/oppgaveSelectors.ts'

export interface OppgaveoversiktPersonProps {
  fnr: string
}

export function OppgaveoversiktPerson(props: OppgaveoversiktPersonProps) {
  const { fnr } = props

  const filterContext = useDataGridFilterContext<'oppgavetype'>()
  const [{ pageNumber, pageSize }, setPageRequest] = usePageRequest(20, 'opn', 'ops')
  const { error, data, pagination, isLoading, isValidating } = useOppgavesøk(
    fnr
      ? {
          oppgavetype: filterContext.oppgavetype ? [...(filterContext.oppgavetype.values as any)] : undefined,
          brukerId: fnr,
          opprettetIntervall: undefined,
          pageNumber,
          pageSize,
        }
      : undefined
  )

  if (error) {
    return <div>Feil ved henting av oppgaver</div>
  }

  return (
    <DataGrid
      rows={data?.oppgaver ?? ingenOppgaver}
      columns={columns}
      keyFactory={selectOppgaveId}
      size="small"
      textSize="small"
      loading={isLoading}
      validating={isValidating}
      emptyMessage="Fant ingen oppgaver for person"
      renderContent={() => {}}
      onPageChange={setPageRequest}
      zebraStripes
      pageSizeSelect
      {...pagination}
    />
  )
}

const ingenOppgaver: never[] = []

const columns = [
  { ...oppgaveColumns.oppgaveId, sortKey: undefined },
  {
    ...oppgaveColumns.oppgavetype,
    filter: {
      options: new Map([
        ['JOURNALFØRING', 'Journalføring'],
        ['BEHANDLE_SAK', 'Behandle sak'],
      ]),
    },
  },
  { ...oppgaveColumns.behandlingstema, filter: undefined },
  { ...oppgaveColumns.behandlingstype, filter: undefined },
  { ...oppgaveColumns.prioritet, filter: undefined },
  oppgaveColumns.opprettetTidspunkt,
  { ...oppgaveColumns.ferdigstiltTidspunkt, sortKey: undefined },
  oppgaveColumns.gåTilOppgave,
]
