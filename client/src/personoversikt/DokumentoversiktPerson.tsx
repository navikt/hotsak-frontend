import { useEffect, useMemo } from 'react'

import { useDokumentsøk } from '../dokument/useDokumentsøk.ts'
import { Details, DetailsItem } from '../felleskomponenter/Details.tsx'
import { usePageRequest } from '../felleskomponenter/Page.ts'
import { DataGrid } from '../felleskomponenter/data/DataGrid.tsx'
import { useDataGridFilterContext } from '../felleskomponenter/data/DataGridFilterContext.ts'
import type { Journalpost } from '../types/types.internal.ts'
import { dokumentColumns, journalpostKey, type DokumentColumnField } from './dokumentColumns.tsx'

export interface DokumentoversiktPersonProps {
  fnr: string
}

export function DokumentoversiktPerson(props: DokumentoversiktPersonProps) {
  const { fnr } = props

  const filterContext = useDataGridFilterContext<DokumentColumnField>()
  const [{ pageNumber, pageSize }, setPageRequest] = usePageRequest(20, 'dpn', 'dps')
  const { error, journalposter, pagination, isLoading, isValidating, reset } = useDokumentsøk({
    fnr,
    journalposttype: filterContext.journalposttype ? [...(filterContext.journalposttype.values as any)] : undefined,
    fraDato: undefined, // selectedRange?.from?.toISOString(),
    tilDato: undefined, // selectedRange?.to?.toISOString(),
    pageNumber,
    pageSize,
  })
  useEffect(() => {
    reset()
  }, [filterContext.journalposttype])

  if (error) {
    return <div>Feil ved henting av dokumenter</div>
  }

  return (
    <DataGrid
      rows={journalposter}
      columns={columns}
      keyFactory={journalpostKey}
      size="small"
      textSize="small"
      loading={isLoading}
      validating={isValidating}
      emptyMessage="Fant ingen dokumenter for person"
      renderContent={DokumentdetaljerPerson}
      onPageChange={setPageRequest}
      zebraStripes
      pageSizeSelect
      {...pagination}
    />
  )
}

function DokumentdetaljerPerson({ row: journalpost }: { row: Journalpost }) {
  const vedlegg = useMemo(
    () =>
      journalpost.dokumenter
        .flatMap((it) => it.logiskeVedlegg)
        .map((it) => it.tittel)
        .join(', ') ?? [],
    [journalpost.dokumenter]
  )
  return (
    <div>
      <Details>
        {vedlegg && <DetailsItem label="Vedlegg">{vedlegg}</DetailsItem>}
        <DetailsItem label="Innsynsregel">{journalpost.innsynsregel.term}</DetailsItem>
      </Details>
    </div>
  )
}

const columns = [
  dokumentColumns.tittel,
  dokumentColumns.journalposttype,
  dokumentColumns.journalpostOpprettetTid,
  dokumentColumns.journalpostId,
  dokumentColumns.fagsakId,
  dokumentColumns.sakIdLink,
]
