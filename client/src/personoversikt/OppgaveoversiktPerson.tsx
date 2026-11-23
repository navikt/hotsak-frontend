import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, HGrid, Loader } from '@navikt/ds-react'
import { Fragment, useState } from 'react'

import { DataGrid, type DataGridContentProps } from '../felleskomponenter/data/DataGrid.tsx'
import { useDataGridFilterContext } from '../felleskomponenter/data/DataGridFilterContext.ts'
import { DataGridToolbar } from '../felleskomponenter/data/DataGridToolbar.tsx'
import { IconLink } from '../felleskomponenter/IconLink.tsx'
import { usePageRequest } from '../felleskomponenter/Page.ts'
import type { FinnOppgaverRequest, Oppgave } from '../oppgave/oppgaveTypes.ts'
import { useOppgavesøk } from '../oppgave/useOppgavesøk.ts'
import { oppgaveColumns } from '../oppgaveliste/oppgaveColumns.tsx'
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

  const filterContext = useDataGridFilterContext<'oppgavetype'>()
  const [{ pageNumber, pageSize }, setPageRequest] = usePageRequest(50, 'opn', 'ops')
  const [sort, setSort] = useState<Pick<FinnOppgaverRequest, 'sorteringsfelt' | 'sorteringsrekkefølge'>>({
    sorteringsfelt: 'OPPRETTET_TIDSPUNKT',
    sorteringsrekkefølge: 'DESC',
  })
  const { error, data, pagination, isLoading, isValidating } = useOppgavesøk(
    fnr
      ? {
          oppgavetype: filterContext.oppgavetype ? [...(filterContext.oppgavetype.values as any)] : undefined,
          brukerId: fnr,
          opprettetIntervall: undefined,
          pageNumber,
          pageSize,
          ...sort,
        }
      : undefined
  )

  if (error) {
    return <div>Feil ved henting av oppgaver</div>
  }

  const oppgaver = data?.oppgaver ?? ingenOppgaver

  return (
    <Box>
      <DataGridToolbar elements={oppgaver.length} elementsName="oppgaver" {...data} />
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
        onSortChange={() => {
          setSort((state) => {
            if (state.sorteringsrekkefølge === 'DESC') {
              return { ...state, sorteringsrekkefølge: 'ASC' }
            } else {
              return { ...state, sorteringsrekkefølge: 'DESC' }
            }
          })
        }}
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
        <HGrid gap="space-12" columns="max-content min-content" align="start">
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
                {journalposttypeTagKort(type)}
              </Fragment>
            )
          })}
        </HGrid>
      )}
    </OppgaveDetailsItem>
  )
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
  { ...oppgaveColumns.prioritet, filter: undefined },
  oppgaveColumns.opprettetTidspunkt,
  { ...oppgaveColumns.ferdigstiltTidspunkt, sortKey: undefined },
  oppgaveColumns.gåTilOppgave,
]
