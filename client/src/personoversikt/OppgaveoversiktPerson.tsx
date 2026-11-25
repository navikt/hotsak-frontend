import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, HGrid, Loader } from '@navikt/ds-react'
import { Fragment, useCallback, useState } from 'react'

import { DataGrid, type DataGridContentProps } from '../felleskomponenter/data/DataGrid.tsx'
import type { DataGridFilterValues } from '../felleskomponenter/data/DataGridFilter.ts'
import { useDataGridFilterContext } from '../felleskomponenter/data/DataGridFilterContext.ts'
import { DataGridToolbar } from '../felleskomponenter/data/DataGridToolbar.tsx'
import { FormatDateTime } from '../felleskomponenter/format/FormatDateTime.tsx'
import { IconLink } from '../felleskomponenter/IconLink.tsx'
import { usePageRequest } from '../felleskomponenter/Page.ts'
import type { FinnOppgaverRequest, Oppgave } from '../oppgave/oppgaveTypes.ts'
import { useOppgavesøk } from '../oppgave/useOppgavesøk.ts'
import { oppgaveColumns, type OppgaveColumnField } from '../oppgaveliste/oppgaveColumns.tsx'
import { OppgaveDetails } from '../oppgaveliste/OppgaveDetails.tsx'
import { OppgaveDetailsItem } from '../oppgaveliste/OppgaveDetailsItem.tsx'
import { selectOppgaveId } from '../oppgaveliste/oppgaveSelectors.ts'
import { useAlleJournalposterForSak } from '../saksbilde/useJournalposter.ts'
import type { Journalpost } from '../types/types.internal.ts'
import { journalposttypeTagKort } from './dokumentColumns.tsx'
import classes from './OppgaveoversiktPerson.module.css'

export interface OppgaveoversiktPersonProps {
  fnr: string
}

export function OppgaveoversiktPerson(props: OppgaveoversiktPersonProps) {
  const { fnr } = props

  const filterContext = useDataGridFilterContext<OppgaveColumnField>()
  const [{ pageNumber, pageSize }, setPageRequest] = usePageRequest(50, 'opn', 'ops')
  const [sort, setSort] = useState<Pick<FinnOppgaverRequest, 'sorteringsfelt' | 'sorteringsrekkefølge'>>({
    sorteringsfelt: 'OPPRETTET_TIDSPUNKT',
    sorteringsrekkefølge: 'DESC',
  })
  const { error, data, pagination, isLoading, isValidating } = useOppgavesøk(
    fnr
      ? {
          prioritet: filterValues(filterContext.prioritet),
          oppgavetype: filterValues(filterContext.oppgavetype),
          brukerId: fnr,
          opprettetIntervall: undefined,
          pageNumber,
          pageSize,
          ...sort,
        }
      : undefined
  )

  const handleSortChange = useCallback((sortKey: string) => {
    setSort((state) => {
      const sorteringsfelt: FinnOppgaverRequest['sorteringsfelt'] =
        sortKey === 'fristDato' ? 'FRIST' : 'OPPRETTET_TIDSPUNKT'
      const sorteringsrekkefølge: FinnOppgaverRequest['sorteringsrekkefølge'] =
        state.sorteringsrekkefølge === 'DESC' ? 'ASC' : 'DESC'
      return { sorteringsfelt, sorteringsrekkefølge }
    })
  }, [])

  if (error) {
    return <div>Feil ved henting av oppgaver</div>
  }

  const oppgaver = data?.oppgaver ?? ingenOppgaver

  return (
    <Box>
      <DataGridToolbar elements={oppgaver.length} elementsName="oppgaver" paddingBlock="space-0 space-8" {...data} />
      <DataGrid
        rows={oppgaver}
        columns={columns}
        keyFactory={selectOppgaveId}
        size="small"
        textSize="small"
        loading={isLoading}
        validating={isValidating}
        emptyMessage="Fant ingen oppgaver for person"
        renderContent={InternalOppgaveDetails}
        onPageChange={setPageRequest}
        onSortChange={handleSortChange}
        stickyHeader
        zebraStripes
        {...pagination}
      />
    </Box>
  )
}

function InternalOppgaveDetails(props: DataGridContentProps<Oppgave>) {
  return (
    <OppgaveDetails {...props} visBruker={false}>
      {props.row.sakId && <OppgaveDetailsDokumenter sakId={props.row.sakId} />}
    </OppgaveDetails>
  )
}

function OppgaveDetailsDokumenter({ sakId }: { sakId: string }) {
  const { dokumenter, isLoading } = useAlleJournalposterForSak(sakId)
  return (
    <OppgaveDetailsItem label="Dokumenter">
      {isLoading ? (
        <Loader />
      ) : (
        <HGrid gap="space-12" columns="max-content min-content min-content" align="center">
          {dokumenter.map((dokument) => {
            const href = `/api/journalpost/${dokument.journalpostId}/${dokument.dokumentId}`

            let type: Journalpost['journalposttype']
            switch (dokument.type) {
              case 'INNGÅENDE':
                type = 'I'
                break
              case 'UTGÅENDE':
                type = 'U'
                break
              case 'NOTAT':
                type = 'N'
                break
              default:
                type = dokument.type
            }

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
                <BodyShort size="small" className={classes.text} title="Tidspunkt for når dokumentet ble opprettet">
                  <FormatDateTime dateTime={dokument.opprettet} />
                </BodyShort>
                {journalposttypeTagKort(type)}
              </Fragment>
            )
          })}
        </HGrid>
      )}
    </OppgaveDetailsItem>
  )
}

function filterValues(filter?: DataGridFilterValues): any[] | undefined {
  if (filter && filter.values && filter.values.size > 0) {
    return [...filter.values]
  }
  return
}

const ingenOppgaver: never[] = []

const columns = [
  { ...oppgaveColumns.oppgaveId, sortKey: undefined },
  {
    ...oppgaveColumns.oppgavetype,
    filter: {
      options: new Map([
        ['JOURNALFØRING', 'Journalføring'],
        ['BEHANDLE_SAK', 'Behandle sak'],
      ]),
    },
  },
  { ...oppgaveColumns.behandlingstema, filter: undefined },
  { ...oppgaveColumns.behandlingstype, filter: undefined },
  { ...oppgaveColumns.nøkkelord, filter: undefined },
  { ...oppgaveColumns.mappenavn, filter: undefined },
  { ...oppgaveColumns.prioritet, filter: undefined },
  oppgaveColumns.opprettetTidspunkt,
  oppgaveColumns.fristDato,
  { ...oppgaveColumns.ferdigstiltTidspunkt, sortKey: undefined },
  { ...oppgaveColumns.saksbehandler, filter: undefined },
  oppgaveColumns.gåTilOppgave,
]
