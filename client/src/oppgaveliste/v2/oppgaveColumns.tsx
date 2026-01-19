import { HourglassBottomFilledIcon } from '@navikt/aksel-icons'
import { BodyShort, HStack, Tag } from '@navikt/ds-react'
import { isBefore } from 'date-fns'

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
import { TaEllerÅpneOppgave } from './TaEllerÅpneOppgave.tsx'
import { ÅpneOppgave } from './ÅpneOppgave.tsx'
import { type DataGridColumn } from '../../felleskomponenter/data/DataGrid.tsx'
import { beregnAlder } from '../../utils/dato.ts'
import { MineOppgaverMenu } from './MineOppgaverMenu.tsx'
import { MedarbeidersOppgaverMenu } from './MedarbeidersOppgaverMenu.tsx'

import classes from './oppgaveColumns.module.css'

type OppgaveColumns = {
  [K in string]: DataGridColumn<OppgaveV2> & { field: K }
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
      options: toDataGridFilterOptions(
        OppgavetypeLabel,
        // Oppgavetype.JOURNALFØRING,
        Oppgavetype.BEHANDLE_SAK
        // Oppgavetype.GODKJENNE_VEDTAK,
        // Oppgavetype.BEHANDLE_UNDERKJENT_VEDTAK
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
      options: new Set(['Bestilling', 'Digital søknad', 'Hastebestilling', 'Hastesøknad']),
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
  brukerAlder: {
    field: 'brukerAlder',
    header: 'Alder',
    // sortKey: 'alder',
    width: 150,
    /*
    filter: {
      options: new Set(['Under 18 år', 'Over 18 år']),
    },
    */
    renderCell(row) {
      const bruker = row.bruker
      if (!bruker || !bruker.fødselsdato) {
        return null
      }
      return `${beregnAlder(bruker.fødselsdato)} år`
    },
  },
  innsenderNavn: {
    field: 'innsenderNavn',
    header: 'Innsender',
    width: 150,
    renderCell(row) {
      const innsender = row.innsender
      if (!innsender) {
        return null
      }
      return innsender.fulltNavn
    },
  },
  mineOppgaverMenu: {
    field: 'mineOppgaverMenu',
    width: 50,
    renderCell(row) {
      return <MineOppgaverMenu oppgave={row} />
    },
  },
  medarbeidersOppgaverMenu: {
    field: 'medarbeidersOppgaverMenu',
    width: 50,
    renderCell(row) {
      return <MedarbeidersOppgaverMenu oppgave={row} />
    },
  },
} satisfies OppgaveColumns

export type OppgaveColumnField = keyof typeof oppgaveColumns

export function getOppgaveColumn(field: OppgaveColumnField): DataGridColumn<OppgaveV2> {
  const column = oppgaveColumns[field]
  if (column == null) {
    throw new Error(`Fant ikke kolonne: ${field}`)
  }
  return column
}

export interface OppgaveColumnState {
  field: OppgaveColumnField
  order: number
  checked: boolean
}
