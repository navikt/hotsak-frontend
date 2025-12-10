import { useMemo, useState } from 'react'

import { LinkButton } from '../../felleskomponenter/button/LinkButton.tsx'
import { DataGrid, type DataGridColumn } from '../../felleskomponenter/data/DataGrid.tsx'
import { type OppgaveId, type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { TaOppgaveButton } from '../../oppgave/TaOppgaveButton.tsx'
import { OppgaveDetails } from './OppgaveDetails.tsx'
import { useOppgaveFilterContext } from './OppgaveFilterContext.tsx'
import { useOppgaveColumns } from './useOppgaveColumns.ts'

export interface EnhetensOppgaverTableProps {
  oppgaver: OppgaveV2[]
  loading?: boolean
}

export function EnhetensOppgaverTable(props: EnhetensOppgaverTableProps) {
  const { oppgaver, loading } = props
  const { sort, setSort } = useOppgaveFilterContext()
  const [valgte, setValgte] = useState<Set<OppgaveId>>(new Set())

  const extraColumns: DataGridColumn<OppgaveV2>[] = useMemo(
    () => [
      {
        field: 'knapp',
        width: 150,
        renderCell(row) {
          return (
            <>
              {valgte.has(row.oppgaveId) ? (
                <LinkButton size="xsmall" type="button" variant="tertiary" to={`/oppgave/${row.oppgaveId}`}>
                  Åpne oppgave
                </LinkButton>
              ) : (
                <TaOppgaveButton
                  size="xsmall"
                  variant="tertiary"
                  oppgave={row}
                  onOppgavetildeling={(id) => {
                    setValgte((previous) => new Set([...previous, id]))
                  }}
                >
                  Ta oppgave
                </TaOppgaveButton>
              )}
            </>
          )
        },
      },
    ],
    [valgte]
  )

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
