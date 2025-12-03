import { BodyShort } from '@navikt/ds-react'
import { useMemo } from 'react'

import { DataGrid, type DataGridColumn } from '../../felleskomponenter/data/DataGrid.tsx'
import { type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { oppgaveColumns } from './oppgaveColumns.tsx'
import { OppgaveDetails } from './OppgaveDetails.tsx'
import { useOppgaveFilterContext } from './OppgaveFilterContext.tsx'

import classes from './MedarbeidersOppgaverTable.module.css'

export interface MedarbeidersOppgaverTableProps {
  oppgaver: OppgaveV2[]
  loading?: boolean
}

export function MedarbeidersOppgaverTable(props: MedarbeidersOppgaverTableProps) {
  const { oppgaver, loading } = props
  const { sort, setSort } = useOppgaveFilterContext()

  const columns: DataGridColumn<OppgaveV2>[] = useMemo(
    () => [
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
    []
  )

  return (
    <DataGrid
      rows={oppgaver}
      columns={columns}
      keyFactory={(oppgave) => oppgave.oppgaveId}
      renderContent={(oppgave, visible) => <OppgaveDetails oppgave={oppgave} visible={visible} />}
      size="medium"
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
