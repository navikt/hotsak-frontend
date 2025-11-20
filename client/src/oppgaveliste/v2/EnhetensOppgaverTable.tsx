import { Button } from '@navikt/ds-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { DataGrid, type DataGridColumn } from '../../felleskomponenter/data/DataGrid.tsx'
import { type OppgaveId, type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { TaOppgaveButton } from '../../oppgave/TaOppgaveButton.tsx'
import { oppgaveColumns } from './oppgaveColumns.tsx'
import { useOppgaveFilterContext } from './OppgaveFilterContext.tsx'

export interface EnhetensOppgaverTableProps {
  oppgaver: OppgaveV2[]
}

export function EnhetensOppgaverTable(props: EnhetensOppgaverTableProps) {
  const { oppgaver } = props
  const { sort, setSort } = useOppgaveFilterContext()
  const navigate = useNavigate()
  const [valgte, setValgte] = useState<Record<OppgaveId, boolean>>({})

  const columns: DataGridColumn<OppgaveV2>[] = useMemo(
    () => [
      {
        field: 'knapp',
        width: 150,
        renderCell(row) {
          return (
            <>
              {valgte[row.oppgaveId] ? (
                <Button
                  size="xsmall"
                  type="button"
                  variant="tertiary"
                  onClick={() => navigate(`/oppgave/${row.oppgaveId}`)}
                >
                  Åpne oppgave
                </Button>
              ) : (
                <TaOppgaveButton
                  size="xsmall"
                  variant="tertiary"
                  oppgave={row}
                  onOppgavetildeling={(id) => {
                    setValgte({ ...valgte, [id]: true })
                  }}
                >
                  Tildel meg
                </TaOppgaveButton>
              )}
            </>
          )
        },
      },
      oppgaveColumns.oppgavetype,
      oppgaveColumns.behandlingstema,
      oppgaveColumns.behandlingstype,
      oppgaveColumns.beskrivelse,
      oppgaveColumns.kommune,
      oppgaveColumns.mappenavn,
      oppgaveColumns.prioritet,
      oppgaveColumns.opprettetTidspunkt,
      oppgaveColumns.fristFerdigstillelse,
      {
        field: 'fnr',
        header: 'Bruker',
        sortKey: 'fnr',
        width: 150,
      },
    ],
    [navigate, valgte]
  )

  return (
    <DataGrid
      rows={oppgaver}
      columns={columns}
      keyFactory={(oppgave) => oppgave.oppgaveId}
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
