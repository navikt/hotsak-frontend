import { Button, Link, Tag, type TagProps } from '@navikt/ds-react'

import { useDokumentsøk } from '../dokument/useDokumentsøk.ts'
import { DataGrid, type DataGridColumn } from '../felleskomponenter/data/DataGrid.tsx'
import { type Journalpost } from '../types/types.internal.ts'

export interface DokumentoversiktPersonProps {
  fnr: string
}

const columns: DataGridColumn<Journalpost>[] = [
  {
    field: 'journalpostId',
    header: 'Journalpost-ID',
    width: 110,
  },
  {
    field: 'journalposttype',
    header: 'Type',
    width: 175,
    renderCell: ({ journalposttype }) => journalposttypeTag(journalposttype),
  },
  {
    field: 'journalpostOpprettetTid',
    header: 'Opprettet',
    width: 145,
    formatDateTime: true,
  },
  {
    field: 'tittel',
    header: 'Tittel',
  },
  {
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
  {
    field: 'sakId',
    header: 'Sak',
    width: 100,
    renderCell: ({ sakId }) => (sakId ? <Link href={`/sak/${sakId}`}>Åpne sak</Link> : null),
  },
  {
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
]

export function DokumentoversiktPerson(props: DokumentoversiktPersonProps) {
  const { fnr } = props
  const { journalposter, isLoading } = useDokumentsøk({ fnr })
  return (
    <DataGrid
      rows={journalposter}
      columns={columns}
      keyFactory={journalpostKey}
      size="small"
      textSize="small"
      loading={isLoading}
    />
  )
}

function journalpostKey(journalpost: Journalpost): string {
  return journalpost.journalpostId
}

function journalposttypeTag(type: Journalpost['journalposttype']) {
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
