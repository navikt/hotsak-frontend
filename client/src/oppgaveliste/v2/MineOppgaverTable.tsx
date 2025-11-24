import { Button } from '@navikt/ds-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router'

import { DataGrid, type DataGridColumn } from '../../felleskomponenter/data/DataGrid.tsx'
import { type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { oppgaveColumns } from './oppgaveColumns.tsx'
import { OppgaveDetails } from './OppgaveDetails.tsx'
import { useOppgaveFilterContext } from './OppgaveFilterContext.tsx'

export interface MineOppgaverTableProps {
  oppgaver: OppgaveV2[]
}

export function MineOppgaverTable(props: MineOppgaverTableProps) {
  const { oppgaver } = props
  const { sort, setSort } = useOppgaveFilterContext()
  const navigate = useNavigate()

  const columns: DataGridColumn<OppgaveV2>[] = useMemo(
    () => [
      {
        field: 'knapp',
        width: 150,
        renderCell(row) {
          return (
            <Button
              size="xsmall"
              type="button"
              variant="tertiary"
              onClick={() => navigate(`/oppgave/${row.oppgaveId}`)}
            >
              Åpne oppgave
            </Button>
          )
        },
      },
      oppgaveColumns.oppgavetype,
      oppgaveColumns.behandlingstema,
      oppgaveColumns.behandlingstype,
      oppgaveColumns.beskrivelse,
      oppgaveColumns.mappenavn,
      oppgaveColumns.prioritet,
      oppgaveColumns.opprettetTidspunkt,
      oppgaveColumns.fristFerdigstillelse,
      oppgaveColumns.bruker,
      oppgaveColumns.kommune,
    ],
    [navigate]
  )

  return (
    <DataGrid
      rows={oppgaver}
      columns={columns}
      keyFactory={(oppgave) => oppgave.oppgaveId}
      renderContent={(oppgave, visible) => <OppgaveDetails oppgave={oppgave} visible={visible} />}
      size="medium"
      textSize="small"
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
