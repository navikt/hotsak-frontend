import { Link, Tag, TagProps } from '@navikt/ds-react'
import { Link as ReactRouterLink } from 'react-router'

import { DataGridColumn } from '../felleskomponenter/data/DataGrid'
import { Journalpost } from '../types/types.internal'

type DokumentColumns = {
  [K in string]: DataGridColumn<Journalpost> & { field: K }
}

export const dokumentColumns = {
  journalpostId: {
    field: 'journalpostId',
    header: 'Journalpost-ID',
    width: 110,
  },
  journalposttype: {
    field: 'journalposttype',
    header: 'Type',
    width: 100,
    filter: {
      options: new Map([
        ['I', 'Inngående'],
        ['U', 'Utgående'],
        ['N', 'Notat'],
      ]),
    },
    renderCell({ journalposttype }) {
      return journalposttypeTag(journalposttype)
    },
  },
  journalpostOpprettetTid: {
    field: 'journalpostOpprettetTid',
    header: 'Opprettet',
    width: 145,
    formatDateTime: true,
  },
  fagsakId: {
    field: 'fagsakId',
    header: 'Saksnr.',
    width: 100,
    renderCell({ sak, sakId }) {
      if (sakId) return sakId
      if (sak) return sak.fagsakId
      return null
    },
  },
  sakIdLink: {
    field: 'sakIdLink',
    width: 100,
    renderCell({ sak, sakId }) {
      if (sakId)
        return (
          <Link as={ReactRouterLink} to={`/sak/${sakId}`}>
            Gå til saken
          </Link>
        )
      if (sak) return sak.fagsakId
      return null
    },
  },
  tittel: {
    field: 'tittel',
    header: 'Tittel',
    width: 180,
    renderCell(journalpost) {
      const førsteDokument = journalpost.dokumenter[0]
      if (!førsteDokument) return null
      return (
        <Link href={`/api/journalpost/${førsteDokument.journalpostId}/${førsteDokument.dokumentId}`} target="_blank">
          {journalpost.tittel}
        </Link>
      )
    },
  },
  journalstatus: {
    field: 'journalstatus',
    header: 'Status',
    width: 100,
    renderCell({ journalstatus }) {
      return journalstatus ? <Tag size="small">{journalstatus}</Tag> : null
    },
  },
} satisfies DokumentColumns

export type DokumentColumnField = keyof typeof dokumentColumns

export function journalpostKey(journalpost: Journalpost): string {
  return journalpost.journalpostId
}

type JournalposttypeTagProps = TagProps

const journalpostTypes: Record<Journalpost['journalposttype'], JournalposttypeTagProps> = {
  I: { children: 'Inngående', title: 'Inngående dokument', 'data-color': 'brand-beige' },
  U: { children: 'Utgående', title: 'Utgående dokument', 'data-color': 'meta-lime' },
  N: { children: 'Notat', title: 'Notat', 'data-color': 'info' },
}

export function journalposttypeTag(type: Journalpost['journalposttype']) {
  return <Tag size="small" variant="outline" {...journalpostTypes[type]} />
}

export function journalposttypeTagKort(type: Journalpost['journalposttype']) {
  const types: Record<typeof type, JournalposttypeTagProps> = {
    I: { ...journalpostTypes['I'], children: 'I' },
    U: { ...journalpostTypes['U'], children: 'U' },
    N: { ...journalpostTypes['N'], children: 'N' },
  }
  return <Tag size="small" variant="outline" {...types[type]} />
}

export function journalpoststatusTagKort(type: Journalpost['journalstatus']) {
  const types: Record<typeof type, TagProps> = {
    MOTTATT: { children: 'M', 'data-color': 'neutral', title: 'Mottatt' },
    JOURNALFOERT: { children: 'JF', 'data-color': 'neutral', title: 'Journalført' },
    FERDIGSTILT: { children: 'F', 'data-color': 'neutral', title: 'Ferdigstilt' },
    EKSPEDERT: { children: 'E', 'data-color': 'neutral', title: 'Ekspedert' },
    UNDER_ARBEID: { children: 'UA', 'data-color': 'neutral', title: 'Under arbeid' },
    FEILREGISTRERT: { children: 'FR', 'data-color': 'neutral', title: 'Feilregistrert' },
    UTGAAR: { children: 'U', 'data-color': 'neutral', title: 'Utgår' },
    AVBRUTT: { children: 'A', 'data-color': 'neutral', title: 'Avbrutt' },
    UKJENT_BRUKER: { children: 'UB', 'data-color': 'neutral', title: 'Ukjent bruker' },
    RESERVERT: { children: 'R', 'data-color': 'neutral', title: 'Reservert' },
    OPPLASTING_DOKUMENT: { children: 'OD', 'data-color': 'neutral', title: 'Opplasting dokument' },
    UKJENT: { children: '?', 'data-color': 'neutral', title: 'Ukjent' },
  }
  return <Tag size="small" variant="outline" {...types[type]} />
}
