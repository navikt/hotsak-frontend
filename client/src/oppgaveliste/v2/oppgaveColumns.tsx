import { HourglassBottomFilledIcon } from '@navikt/aksel-icons'
import { HStack } from '@navikt/ds-react'
import { isBefore } from 'date-fns'
import { type DataGridColumn } from '../../felleskomponenter/data/DataGrid.tsx'
import { FormatertDato } from '../../felleskomponenter/format/FormatertDato.tsx'
import { OppgaveprioritetLabel, OppgavetypeLabel, type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'

export const oppgaveColumns = {
  oppgavetype: {
    field: 'oppgavetype',
    header: 'Oppgavetype',
    renderCell(row) {
      return <>{OppgavetypeLabel[row.oppgavetype]}</>
    },
  },
  behandlingstema: {
    field: 'behandlingstema',
    header: 'Gjelder',
  },
  behandlingstype: {
    field: 'behandlingstype',
    header: 'Behandlingstype',
  },
  mappenavn: {
    field: 'mappenavn',
    header: 'Mappe',
  },
  prioritet: {
    field: 'prioritet',
    header: 'Prioritet',
    renderCell(row) {
      return <>{OppgaveprioritetLabel[row.prioritet]}</>
    },
  },
  opprettetTidspunkt: {
    field: 'opprettetTidspunkt',
    header: 'Opprettet',
    sortKey: 'opprettetTidspunkt',
    renderCell(row) {
      return <FormatertDato dato={row.opprettetTidspunkt} />
    },
  },
  fristFerdigstillelse: {
    field: 'fristFerdigstillelse',
    header: 'Frist',
    sortKey: 'fristFerdigstillelse',
    renderCell(row) {
      return (
        <HStack align="center" gap="2">
          <FormatertDato dato={row.fristFerdigstillelse} />
          {row.fristFerdigstillelse && isBefore(row.fristFerdigstillelse, Date.now()) && (
            <HourglassBottomFilledIcon color="var(--ax-text-danger-decoration)" />
          )}
        </HStack>
      )
    },
  },
} satisfies Record<string, DataGridColumn<OppgaveV2>>
