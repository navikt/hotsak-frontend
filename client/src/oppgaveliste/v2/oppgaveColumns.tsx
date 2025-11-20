import { HourglassBottomFilledIcon } from '@navikt/aksel-icons'
import { HStack, Tag } from '@navikt/ds-react'
import { isBefore } from 'date-fns'

import { type DataGridColumn } from '../../felleskomponenter/data/DataGrid.tsx'
import { FormatertDato } from '../../felleskomponenter/format/FormatertDato.tsx'
import { OppgaveprioritetLabel, OppgavetypeLabel, type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { storForbokstavIOrd } from '../../utils/formater.ts'

export const oppgaveColumns = {
  oppgavetype: {
    field: 'oppgavetype',
    header: 'Oppgavetype',
    width: 200,
    renderCell(row) {
      return (
        <Tag size="small" variant="alt2">
          {OppgavetypeLabel[row.oppgavetype]}
        </Tag>
      )
    },
  },
  behandlingstema: {
    field: 'behandlingstema',
    header: 'Gjelder',
    width: 250,
    renderCell(row) {
      if (!row.behandlingstema) {
        return null
      }
      return (
        <Tag size="small" variant="alt3">
          {row.behandlingstema}
        </Tag>
      )
    },
  },
  behandlingstype: {
    field: 'behandlingstype',
    header: 'Behandlingstype',
    width: 200,
    renderCell(row) {
      if (!row.behandlingstype) {
        return null
      }
      return (
        <Tag size="small" variant="alt3">
          {row.behandlingstype}
        </Tag>
      )
    },
  },
  beskrivelse: {
    field: 'beskrivelse',
    header: 'Beskrivelse',
    renderCell(row) {
      if (!row.beskrivelse) {
        return null
      }
      const beskrivelse = row.beskrivelse.replace('Søknad om:', '').replace('Bestilling av:', '').trim()
      return <>{storForbokstavIOrd(beskrivelse)}</>
    },
  },
  kommune: {
    field: 'kommune',
    header: 'Kommune',
  },
  mappenavn: {
    field: 'mappenavn',
    header: 'Mappe',
  },
  prioritet: {
    field: 'prioritet',
    header: 'Prioritet',
    width: 200,
    renderCell(row) {
      return <>{OppgaveprioritetLabel[row.prioritet]}</>
    },
  },
  opprettetTidspunkt: {
    field: 'opprettetTidspunkt',
    header: 'Opprettet',
    sortKey: 'opprettetTidspunkt',
    width: 150,
    renderCell(row) {
      return <FormatertDato dato={row.opprettetTidspunkt} />
    },
  },
  fristFerdigstillelse: {
    field: 'fristFerdigstillelse',
    header: 'Frist',
    sortKey: 'fristFerdigstillelse',
    width: 150,
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
