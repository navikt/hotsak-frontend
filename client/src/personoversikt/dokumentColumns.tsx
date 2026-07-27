import { Button, Link, Tag, TagProps } from '@navikt/ds-react'
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
    width: 175,
    renderCell: ({ journalposttype }) => journalposttypeTag(journalposttype),
  },
  journalpostOpprettetTid: {
    field: 'journalpostOpprettetTid',
    header: 'Opprettet',
    width: 145,
    formatDateTime: true,
  },
  tittel: {
    field: 'tittel',
    header: 'Tittel',
  },
  dokumenter: {
    field: 'dokumenter',
    header: 'Dokument',
    renderCell: (journalpost) => {
      const førsteDokument = journalpost.dokumenter[0]
      if (!førsteDokument) return null
      return (
        <Link href={`/api/journalpost/${førsteDokument.journalpostId}/${førsteDokument.dokumentId}`} target="_blank">
          {førsteDokument.tittel}
        </Link>
      )
    },
  },
  sakId: {
    field: 'sakId',
    header: 'Sak',
    width: 100,
    renderCell: ({ sakId }) => (sakId ? <Link href={`/sak/${sakId}`}>Åpne sak</Link> : null),
  },
  opprettSak: {
    field: 'opprettSak',
    header: '',
    width: 135,
    renderCell: ({ journalposttype }) =>
      journalposttype === 'I' ? (
        <Button size="small" variant="secondary">
          Opprett sak
        </Button>
      ) : null,
  },
} satisfies DokumentColumns

export function journalpostKey(journalpost: Journalpost): string {
  return journalpost.journalpostId
}

export function journalposttypeTag(type: Journalpost['journalposttype']) {
  const config: Record<typeof type, { label: string; color: TagProps['data-color'] }> = {
    I: { label: 'Inngående dokument', color: 'meta-purple' },
    U: { label: 'Utgående dokument', color: 'meta-lime' },
    N: { label: 'Notat', color: 'neutral' },
  }
  const { label, color } = config[type]
  return (
    <Tag size="small" variant="outline" data-color={color}>
      {label}
    </Tag>
  )
}
