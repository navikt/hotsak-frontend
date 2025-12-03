import { HourglassBottomFilledIcon } from '@navikt/aksel-icons'
import { HStack, Tag } from '@navikt/ds-react'
import { isBefore } from 'date-fns'

import { type DataGridColumn } from '../../felleskomponenter/data/DataGrid.tsx'
import { FormatertDato } from '../../felleskomponenter/format/FormatertDato.tsx'
import { OppgaveprioritetLabel, OppgavetypeLabel, type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { formaterFødselsnummer, storForbokstavIOrd } from '../../utils/formater.ts'

import classes from './oppgaveColumns.module.css'

export const oppgaveColumns = {
  oppgavetype: {
    field: 'oppgavetype',
    header: 'Oppgavetype',
    width: 200,
    renderCell(row) {
      return (
        <Tag size="small" variant="alt2" className={classes.tag}>
          {OppgavetypeLabel[row.kategorisering.oppgavetype]}
        </Tag>
      )
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
      return (
        <Tag size="small" variant="alt3" className={classes.tag}>
          {behandlingstema.term}
        </Tag>
      )
    },
  },
  behandlingstype: {
    field: 'behandlingstype',
    header: 'Behandlingstype',
    width: 200,
    renderCell(row) {
      const behandlingstype = row.kategorisering.behandlingstype
      if (!behandlingstype || !behandlingstype.term) {
        return null
      }
      return (
        <Tag size="small" variant="alt3" className={classes.tag}>
          {behandlingstype.term}
        </Tag>
      )
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
      return <>{storForbokstavIOrd(beskrivelse)}</>
    },
  },
  kommune: {
    field: 'kommune',
    header: 'Kommune / bydel',
    renderCell(row) {
      const bydel = row.bruker?.bydel
      if (bydel) {
        return <>{bydel.navn}</>
      }
      const kommune = row.bruker?.kommune
      if (kommune) {
        return <>{kommune.navn}</>
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
  bruker: {
    field: 'bruker',
    header: 'Bruker',
    sortKey: 'fnr',
    width: 300,
    renderCell(row) {
      const bruker = row.bruker
      if (!bruker) {
        return null
      }
      return <>{`${formaterFødselsnummer(bruker.fnr)} | ${bruker.fulltNavn}`}</>
    },
  },
} satisfies Record<string, DataGridColumn<OppgaveV2>>

export type OppgaveColumnKeyType = keyof typeof oppgaveColumns
