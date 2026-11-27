import { BodyShort, Box, HGrid } from '@navikt/ds-react'
import { Fragment, useEffect } from 'react'

import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { useDokumentsøk } from '../dokument/useDokumentsøk.ts'
import { DataGrid } from '../felleskomponenter/data/DataGrid.tsx'
import { useDataGridFilterContext } from '../felleskomponenter/data/DataGridFilterContext.ts'
import { DataGridToolbar } from '../felleskomponenter/data/DataGridToolbar.tsx'
import { Details, DetailsItem } from '../felleskomponenter/Details.tsx'
import { IconLink } from '../felleskomponenter/IconLink.tsx'
import { usePageRequest } from '../felleskomponenter/Page.ts'
import type { Journalpost } from '../types/types.internal.ts'
import { dokumentColumns, journalpostKey, type DokumentColumnField } from './dokumentColumns.tsx'
import classes from './DokumentoversiktPerson.module.css'

export interface DokumentoversiktPersonProps {
  fnr: string
}

export function DokumentoversiktPerson(props: DokumentoversiktPersonProps) {
  const { fnr } = props

  const filterContext = useDataGridFilterContext<DokumentColumnField>()
  const [{ pageNumber, pageSize }, setPageRequest] = usePageRequest(50, 'dpn', 'dps')
  const { error, journalposter, pagination, totalElements, isLoading, isValidating, resetPageCursors } = useDokumentsøk(
    fnr
      ? {
          fnr,
          journalposttype: filterContext.journalposttype
            ? [...(filterContext.journalposttype.values as any)]
            : undefined,
          fraDato: undefined, // selectedRange?.from?.toISOString(),
          tilDato: undefined, // selectedRange?.to?.toISOString(),
          pageNumber,
          pageSize,
        }
      : undefined
  )
  useEffect(() => {
    setPageRequest({ pageNumber: 1, pageSize: 50 })
    resetPageCursors()
  }, [filterContext.journalposttype, setPageRequest, resetPageCursors])

  if (error) {
    return <div>Feil ved henting av dokumenter</div>
  }

  return (
    <Box>
      <DataGridToolbar
        elements={journalposter.length}
        elementsName="dokumenter"
        totalElements={totalElements}
        paddingBlock="space-0 space-8"
        {...pagination}
      />
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
        stickyHeader
        zebraStripes
        {...pagination}
      />
    </Box>
  )
}

function DokumentdetaljerPerson({ row: journalpost }: { row: Journalpost }) {
  return (
    <div>
      <Details>
        {journalpost.dokumenter.length > 0 && (
          <DetailsItem label="Dokumenter">
            <HGrid gap="space-8" columns="min-content min-content">
              {journalpost.dokumenter.map((dokument) => {
                const href = `/api/journalpost/${dokument.journalpostId}/${dokument.dokumentId}`
                const vedlegg = dokument.logiskeVedlegg.map((vedlegg) => vedlegg.tittel).join(', ')
                return (
                  <Fragment key={href}>
                    <BodyShort
                      as={IconLink}
                      icon={<ExternalLinkIcon />}
                      href={href}
                      size="small"
                      target="_blank"
                      className={classes.text}
                    >
                      {dokument.tittel}
                    </BodyShort>
                    {vedlegg.length > 0 && (
                      <BodyShort size="small" className={classes.text}>
                        Vedlegg: {vedlegg}
                      </BodyShort>
                    )}
                  </Fragment>
                )
              })}
            </HGrid>
          </DetailsItem>
        )}
        <DetailsItem label="Innsynsregel">{journalpost.innsynsregel.term}</DetailsItem>
      </Details>
    </div>
  )
}

const columns = [
  { ...dokumentColumns.tittel, width: 300 },
  dokumentColumns.journalstatus,
  dokumentColumns.journalposttype,
  dokumentColumns.journalpostOpprettetTid,
  dokumentColumns.journalpostId,
  dokumentColumns.fagsakId,
  dokumentColumns.fagsaksystem,
  dokumentColumns.sakIdLink,
]
