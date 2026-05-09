import { Link, Tag } from '@navikt/ds-react'

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
  },
  {
    field: 'journalposttype',
    header: 'Type',
    renderCell: ({ journalposttype }) => (
      <Tag size="small" variant="neutral">
        {journalposttype}
      </Tag>
    ),
  },
  {
    field: 'journalpostOpprettetTid',
    header: 'Opprettet',
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
