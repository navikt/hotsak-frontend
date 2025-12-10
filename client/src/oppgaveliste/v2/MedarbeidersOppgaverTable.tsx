import { BodyShort } from '@navikt/ds-react'

import { DataGrid, type DataGridColumn } from '../../felleskomponenter/data/DataGrid.tsx'
import { type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import classes from './MedarbeidersOppgaverTable.module.css'
import { OppgaveDetails } from './OppgaveDetails.tsx'
import { useOppgaveFilterContext } from './OppgaveFilterContext.tsx'
import { useOppgaveColumns } from './useOppgaveColumns.ts'

export interface MedarbeidersOppgaverTableProps {
  oppgaver: OppgaveV2[]
  loading?: boolean
}

export function MedarbeidersOppgaverTable(props: MedarbeidersOppgaverTableProps) {
  const { oppgaver, loading } = props
  const { sort, setSort } = useOppgaveFilterContext()

  const columns = useOppgaveColumns(extraColumns)

  return (
    <DataGrid
      rows={oppgaver}
      columns={columns}
      keyFactory={(oppgave) => oppgave.oppgaveId}
      renderContent={(oppgave, visible) => <OppgaveDetails oppgave={oppgave} visible={visible} />}
      size="small"
      textSize="small"
      emptyMessage="Ingen oppgaver funnet"
      loading={loading}
      sort={sort}
      onSortChange={(sortKey) => {
        setSort({
          orderBy: sortKey || 'fristFerdigstillelse',
          direction: sort?.direction === 'ascending' ? 'descending' : 'ascending',
        })
      }}
      zebraStripes
    />
  )
}

const extraColumns: DataGridColumn<OppgaveV2>[] = [
  {
    field: 'saksbehandler',
    header: 'Saksbehandler',
    width: 150,
    renderCell(row: OppgaveV2) {
      return (
        <BodyShort as="span" size="small" className={classes.saksbehandler}>
          {row.tildeltSaksbehandler?.navn ?? 'Ukjent'}
        </BodyShort>
      )
    },
  },
]
