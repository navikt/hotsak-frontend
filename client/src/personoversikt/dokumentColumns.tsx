import { Link, Tag } from '@navikt/ds-react'
import { Link as ReactRouterLink } from 'react-router'

import { JournalposttypeTag } from '../dokument/DokumentTag'
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
      return <JournalposttypeTag journalposttype={journalposttype} />
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
