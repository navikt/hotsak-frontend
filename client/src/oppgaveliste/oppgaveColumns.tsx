import { HourglassBottomFilledIcon } from '@navikt/aksel-icons'
import { BodyShort, HStack, Tag, Tooltip } from '@navikt/ds-react'
import { isBefore } from 'date-fns'

import { type DataGridColumn } from '../felleskomponenter/data/DataGrid.tsx'
import { toDataGridFilterOptions } from '../felleskomponenter/data/DataGridFilter.ts'
import { FormatDate } from '../felleskomponenter/format/FormatDate.tsx'
import {
  type Oppgave,
  Oppgaveprioritet,
  OppgaveprioritetLabel,
  Oppgavetype,
  OppgavetypeLabel,
} from '../oppgave/oppgaveTypes.ts'
import { OppgaveStatusLabel } from '../types/types.internal.ts'
import { formaterFødselsnummer, storForbokstavIOrd } from '../utils/formater.ts'
import { MineOppgaverMenu } from './MineOppgaverMenu.tsx'

import classes from './oppgaveColumns.module.css'
import { TaEllerÅpneOppgave } from './TaEllerÅpneOppgave.tsx'
import { ÅpneOppgave } from './ÅpneOppgave.tsx'

type OppgaveColumns = {
  [K in string]: DataGridColumn<Oppgave> & { field: K }
}

export const oppgaveColumns = {
  åpneOppgave: {
    field: 'åpneOppgave',
    width: 150,
    renderCell(row) {
      return <ÅpneOppgave oppgave={row} />
    },
  },
  taOppgave: {
    field: 'taOppgave',
    width: 150,
    renderCell(row) {
      return <TaEllerÅpneOppgave oppgave={row} />
    },
  },
  overtaOppgave: {
    field: 'overtaOppgave',
    width: 150,
    renderCell(row) {
      return <TaEllerÅpneOppgave oppgave={row} overta />
    },
  },
  saksbehandler: {
    field: 'saksbehandler',
    header: 'Saksbehandler',
    width: 250,
    filter: {
      options: new Set(),
    },
    renderCell(row) {
      return (
        <BodyShort as="span" size="small" className={classes.saksbehandler}>
          {row.tildeltSaksbehandler?.navn ?? 'Ukjent'}
        </BodyShort>
      )
    },
  },
  oppgavetype: {
    field: 'oppgavetype',
    header: 'Oppgavetype',
    width: 175,
    filter: {
      options: new Set(),
    },
    renderCell(row) {
      return OppgavetypeLabel[row.kategorisering.oppgavetype]
    },
  },
  behandlingstema: {
    field: 'behandlingstema',
    header: 'Gjelder',
    width: 250,
    filter: {
      options: new Set(),
    },
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
    width: 195,
    filter: {
      options: new Set(['Bestilling', 'Digital søknad', 'Hastebestilling', 'Hastesøknad', 'Søknad']), // fixme -> kun agder
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
      if (row.kategorisering.oppgavetype === Oppgavetype.JOURNALFØRING) {
        return row.beskrivelse
      }
      const søknadGjelder = row.sak?.søknadGjelder
      if (!søknadGjelder) {
        return null
      }
      const beskrivelse = søknadGjelder.replace('Søknad om:', '').replace('Bestilling av:', '').trim()
      return storForbokstavIOrd(beskrivelse)
    },
  },
  mappenavn: {
    field: 'mappenavn',
    header: 'Mappe',
    width: 200,
    filter: {
      options: new Set(),
    },
  },
  prioritet: {
    field: 'prioritet',
    header: 'Prioritet',
    width: 135,
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
  innsenderNavn: {
    field: 'innsenderNavn',
    header: 'Innsender',
    width: 150,
    filter: {
      options: new Set(),
    },
    renderCell(row) {
      const innsender = row.innsender
      if (!innsender) {
        return null
      }
      return innsender.fulltNavn
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
  brukerFødselsdato: {
    field: 'brukerFødselsdato',
    header: 'Fødselsdato',
    sortKey: 'fødselsdato',
    width: 125,
    renderCell(row) {
      const bruker = row.bruker
      if (!bruker || bruker.fødselsdato == null) {
        return null
      }
      return <FormatDate date={bruker.fødselsdato} />
    },
  },
  brukerAlder: {
    field: 'brukerAlder',
    header: 'Alder',
    sortKey: 'alder',
    width: 150,
    renderCell(row) {
      const bruker = row.bruker
      if (!bruker || bruker.alder == null) {
        return null
      }
      return `${bruker.alder} år`
    },
  },
  kommune: {
    field: 'kommune',
    header: 'Kommune / bydel',
    width: 200,
    filter: {
      options: new Set(),
    },
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
  saksstatus: {
    field: 'saksstatus',
    header: 'Saksstatus',
    width: 200,
    renderCell(row) {
      const sak = row.sak
      if (!sak) {
        return null
      }
      return OppgaveStatusLabel.get(sak.saksstatus)
    },
  },
  opprettetTidspunkt: {
    field: 'opprettetTidspunkt',
    header: 'Opprettet',
    sortKey: 'opprettetTidspunkt',
    width: 125,
    formatDateTime: true,
  },
  fristFerdigstillelse: {
    field: 'fristFerdigstillelse',
    header: 'Frist',
    sortKey: 'fristFerdigstillelse',
    width: 125,
    renderCell(row) {
      const { fristFerdigstillelse, ferdigstiltTidspunkt } = row
      if (!fristFerdigstillelse) return null
      return (
        <HStack align="center" gap="2" wrap={false}>
          <FormatDate date={fristFerdigstillelse} />
          {!ferdigstiltTidspunkt && isBefore(fristFerdigstillelse, Date.now()) && (
            <Tooltip content="Fristen har gått ut">
              <HourglassBottomFilledIcon color="var(--ax-text-danger-decoration)" width={20} height={20} />
            </Tooltip>
          )}
        </HStack>
      )
    },
  },
  ferdigstiltTidspunkt: {
    field: 'ferdigstiltTidspunkt',
    header: 'Ferdigstilt',
    sortKey: 'ferdigstiltTidspunkt',
    width: 125,
    formatDateTime: true,
  },
  mineOppgaverMenu: {
    field: 'mineOppgaverMenu',
    width: 50,
    renderCell(row) {
      return <MineOppgaverMenu oppgave={row} />
    },
  },
} satisfies OppgaveColumns

export type OppgaveColumnField = keyof typeof oppgaveColumns

export function getOppgaveColumn(id: OppgaveColumnField): DataGridColumn<Oppgave> {
  const column = oppgaveColumns[id]
  if (column == null) {
    throw new Error(`Fant ikke kolonne: ${id}`)
  }
  return column
}

export type DefaultOppgaveColumns = ReadonlyArray<OppgaveColumnField | [OppgaveColumnField, boolean]>
