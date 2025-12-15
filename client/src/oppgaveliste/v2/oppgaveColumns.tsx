import { HourglassBottomFilledIcon } from '@navikt/aksel-icons'
import { HStack, Tag } from '@navikt/ds-react'
import { isBefore } from 'date-fns'

import { type DataGridColumn } from '../../felleskomponenter/data/DataGrid.tsx'
import { FormatDate } from '../../felleskomponenter/format/FormatDate.tsx'
import {
  Oppgaveprioritet,
  OppgaveprioritetLabel,
  Oppgavetype,
  OppgavetypeLabel,
  type OppgaveV2,
} from '../../oppgave/oppgaveTypes.ts'
import { formaterFødselsnummer, storForbokstavIOrd } from '../../utils/formater.ts'
import { toDataGridFilterOptions } from '../../felleskomponenter/data/DataGridFilter.ts'

import classes from './oppgaveColumns.module.css'

export const oppgaveColumns = {
  oppgavetype: {
    field: 'oppgavetype',
    header: 'Oppgavetype',
    width: 150,
    filter: {
      options: toDataGridFilterOptions(
        OppgavetypeLabel,
        Oppgavetype.JOURNALFØRING,
        Oppgavetype.BEHANDLE_SAK,
        Oppgavetype.GODKJENNE_VEDTAK,
        Oppgavetype.BEHANDLE_UNDERKJENT_VEDTAK
      ),
    },
    renderCell(row) {
      return OppgavetypeLabel[row.kategorisering.oppgavetype]
    },
  },
  behandlingstema: {
    field: 'behandlingstema',
    header: 'Gjelder',
    width: 250,
    renderCell(row) {
      const behandlingstema = row.kategorisering.behandlingstema
      if (!behandlingstema || !behandlingstema.term) {
        return null
      }
      return behandlingstema.term
    },
  },
  behandlingstype: {
    field: 'behandlingstype',
    header: 'Behandlingstype',
    width: 150,
    filter: {
      options: new Map([
        ['Bestilling', 'Bestilling'],
        ['Digital søknad', 'Digital søknad'],
        ['Hastebestilling', 'Hastebestilling'],
        ['Hastesøknad', 'Hastesøknad'],
      ]),
    },
    renderCell(row) {
      const behandlingstype = row.kategorisering.behandlingstype
      if (!behandlingstype || !behandlingstype.term) {
        return null
      }
      return behandlingstype.term
    },
  },
  beskrivelse: {
    field: 'beskrivelse',
    header: 'Beskrivelse',
    renderCell(row) {
      const søknadGjelder = row.sak?.søknadGjelder
      if (!søknadGjelder) {
        return null
      }
      const beskrivelse = søknadGjelder.replace('Søknad om:', '').replace('Bestilling av:', '').trim()
      return storForbokstavIOrd(beskrivelse)
    },
  },
  kommune: {
    field: 'kommune',
    header: 'Kommune / bydel',
    renderCell(row) {
      const bydel = row.bruker?.bydel
      if (bydel) {
        return bydel.navn
      }
      const kommune = row.bruker?.kommune
      if (kommune) {
        return kommune.navn
      }
      return null
    },
  },
  mappenavn: {
    field: 'mappenavn',
    header: 'Mappe',
  },
  prioritet: {
    field: 'prioritet',
    header: 'Prioritet',
    width: 100,
    filter: {
      options: toDataGridFilterOptions(
        OppgaveprioritetLabel,
        Oppgaveprioritet.LAV,
        Oppgaveprioritet.NORMAL,
        Oppgaveprioritet.HØY
      ),
    },
    renderCell(row) {
      const prioritet = OppgaveprioritetLabel[row.prioritet]
      if (row.prioritet === Oppgaveprioritet.HØY) {
        return (
          <Tag size="small" variant="warning" className={classes.tag}>
            {prioritet}
          </Tag>
        )
      }
      return prioritet
    },
  },
  opprettetTidspunkt: {
    field: 'opprettetTidspunkt',
    header: 'Opprettet',
    sortKey: 'opprettetTidspunkt',
    width: 125,
    formatDate: true,
  },
  fristFerdigstillelse: {
    field: 'fristFerdigstillelse',
    header: 'Frist',
    sortKey: 'fristFerdigstillelse',
    width: 125,
    renderCell(row) {
      return (
        <HStack align="center" gap="2">
          <FormatDate date={row.fristFerdigstillelse} />
          {row.fristFerdigstillelse && isBefore(row.fristFerdigstillelse, Date.now()) && (
            <HourglassBottomFilledIcon color="var(--ax-text-danger-decoration)" />
          )}
        </HStack>
      )
    },
  },
  brukerFnr: {
    field: 'brukerFnr',
    header: 'Fødselsnummer',
    sortKey: 'fnr',
    width: 100,
    renderCell(row) {
      const bruker = row.bruker
      if (!bruker) {
        return null
      }
      return formaterFødselsnummer(bruker.fnr)
    },
  },
  brukerNavn: {
    field: 'brukerNavn',
    header: 'Navn',
    width: 150,
    renderCell(row) {
      const bruker = row.bruker
      if (!bruker) {
        return null
      }
      return bruker.fulltNavn
    },
  },
} satisfies Record<string, DataGridColumn<OppgaveV2>>

export interface OppgaveColumn {
  key: OppgaveColumnKeyType
  checked: boolean
  order: number
}

export type OppgaveColumnKeyType = keyof typeof oppgaveColumns

export function headerForColumn(key: OppgaveColumnKeyType): string {
  return oppgaveColumns[key]?.header ?? ''
}
