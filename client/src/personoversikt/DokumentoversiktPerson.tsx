import { useDokumentsøk } from '../dokument/useDokumentsøk.ts'
import { DataGrid } from '../felleskomponenter/data/DataGrid.tsx'
import { dokumentColumns, journalpostKey } from './dokumentColumns.tsx'

export interface DokumentoversiktPersonProps {
  fnr: string
}

const columns = [
  dokumentColumns.journalpostId,
  dokumentColumns.journalposttype,
  dokumentColumns.journalpostOpprettetTid,
  dokumentColumns.tittel,
  dokumentColumns.dokumenter,
  dokumentColumns.sakId,
  dokumentColumns.opprettSak,
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
