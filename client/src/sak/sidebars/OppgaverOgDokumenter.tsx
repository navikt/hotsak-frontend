import { Box, Detail, Select, Tabs, VStack } from '@navikt/ds-react'
import { useMemo, useState } from 'react'

import { useDokumentsøk } from '../../dokument/useDokumentsøk'
import { DataGrid } from '../../felleskomponenter/data/DataGrid'
import type { PageRequest } from '../../felleskomponenter/Page'
import { useOppgavesøk } from '../../oppgave/useOppgavesøk'
import { oppgaveColumns } from '../../oppgaveliste/oppgaveColumns'
import { selectOppgaveId } from '../../oppgaveliste/oppgaveSelectors'
import { dokumentColumns, journalpostKey, journalposttypeTagKortere } from '../../personoversikt/dokumentColumns'
import { useSak } from '../../saksbilde/useSak'
import { type Journalpost } from '../../types/types.internal'
import { OppgaveDetailsSaksbilde } from './OppgaverDetailsSaksbilde'
import {
  datoIntervallForFilter,
  OppgaverOgDokumenterFilter,
  OppgaverOgDokumenterFilterValue,
  OppgaverOgDokumenterTab,
  OppgaverOgDokumenterTabs,
  opprettetIntervallForFilter,
} from './OppgaverOgDokumenterUtils'
import { SidebarPanel, SidebarPanelBox, SidebarPanelHeading } from './SidebarPanel'

export function OppgaverOgDokumenter() {
  const { sak } = useSak()

  const [currentTab, setCurrentTab] = useState<OppgaverOgDokumenterTab>(OppgaverOgDokumenterTabs.OPPGAVER)
  const [filter, setFilter] = useState<OppgaverOgDokumenterFilterValue>(OppgaverOgDokumenterFilter.SISTE_2_UKER)

  const fnr = sak?.data.bruker.fnr

  const opprettetIntervall = useMemo(() => opprettetIntervallForFilter(filter), [filter])
  const [pageRequestOppgaver, setPageRequestOppgaver] = usePageRequest()
  const oppgaverResponse = useOppgavesøk(
    fnr
      ? {
          brukerId: fnr,
          sorteringsfelt: 'OPPRETTET_TIDSPUNKT',
          opprettetIntervall,
          alleFagsystemer: true,
          sorteringsrekkefølge: 'DESC',
          ...pageRequestOppgaver,
        }
      : undefined
  )

  const { fraDato, tilDato } = useMemo(() => datoIntervallForFilter(filter), [filter])
  const [pageRequestDokumenter, setPageRequestDokumenter] = usePageRequest()
  const journalposterResponse = useDokumentsøk(
    fnr
      ? {
          fnr,
          fraDato,
          tilDato,
          ...pageRequestDokumenter,
        }
      : undefined
  )

  const totaleOppgaver = useOppgavesøk(
    fnr
      ? {
          brukerId: fnr,
          alleFagsystemer: true,
          pageNumber: 1,
          pageSize: 1,
        }
      : undefined
  ).totalElements
  const totaleDokumenter = useDokumentsøk(
    fnr
      ? {
          fnr,
          pageNumber: 1,
          pageSize: 1,
        }
      : undefined
  ).totalElements

  const alleOppgaver = oppgaverResponse.data?.oppgaver ?? ingenOppgaver

  if (!sak) return null

  return (
    <>
      <SidebarPanelBox paddingBlock={'space-12'}>
        <SidebarPanelHeading tittel="Oppgaver og dokumenter" />
      </SidebarPanelBox>

      <Tabs value={currentTab} size="small" onChange={(value) => setCurrentTab(value as OppgaverOgDokumenterTab)}>
        <VStack gap="space-12">
          <Tabs.List>
            <Tabs.Tab value={OppgaverOgDokumenterTabs.OPPGAVER} label={`Oppgaver (${totaleOppgaver})`} />
            <Tabs.Tab value={OppgaverOgDokumenterTabs.DOKUMENTER} label={`Dokumenter (${totaleDokumenter})`} />
          </Tabs.List>

          <Box width="fit-content" paddingInline="space-8">
            <Select
              label="Tidsperiode"
              hideLabel
              size="small"
              value={filter}
              onChange={(event) => {
                setFilter(event.target.value as OppgaverOgDokumenterFilterValue)
                setPageRequestOppgaver(DEFAULT_PAGE_REQUEST)
                setPageRequestDokumenter(DEFAULT_PAGE_REQUEST)
                journalposterResponse.reset()
              }}
            >
              <option value={OppgaverOgDokumenterFilter.ALLE}>Vis alle</option>
              <option value={OppgaverOgDokumenterFilter.SISTE_2_UKER}>Siste 2 uker</option>
              <option value={OppgaverOgDokumenterFilter.SISTE_6_MND}>Siste 6 måneder</option>
            </Select>
            <Box paddingBlock="space-8">
              <Detail>
                Viser{' '}
                {currentTab === OppgaverOgDokumenterTabs.OPPGAVER
                  ? `${oppgaverResponse.totalElements} `
                  : `${journalposterResponse.totalElements} `}
                av{' '}
                {currentTab === OppgaverOgDokumenterTabs.OPPGAVER
                  ? `${totaleOppgaver} oppgaver`
                  : `${totaleDokumenter} dokumenter`}
              </Detail>
            </Box>
          </Box>

          <Tabs.Panel value={OppgaverOgDokumenterTabs.OPPGAVER}>
            <SidebarPanel tittel="" error={oppgaverResponse.error && 'Feil ved henting av oppgaver.'} spacing={false}>
              <DataGrid
                rows={alleOppgaver}
                columns={oppgaveCols}
                renderContent={OppgaveDetailsSaksbilde}
                keyFactory={selectOppgaveId}
                size="small"
                textSize="small"
                loading={oppgaverResponse.isLoading}
                validating={oppgaverResponse.isValidating}
                onPageChange={setPageRequestOppgaver}
                {...oppgaverResponse.pagination}
              />
            </SidebarPanel>
          </Tabs.Panel>

          <Tabs.Panel value={OppgaverOgDokumenterTabs.DOKUMENTER}>
            <SidebarPanel
              tittel=""
              error={journalposterResponse.error && 'Feil ved henting av dokumenter.'}
              spacing={false}
            >
              <DataGrid
                rows={journalposterResponse.journalposter}
                columns={dokumentCols}
                keyFactory={journalpostKey}
                size="small"
                textSize="small"
                loading={journalposterResponse.isLoading}
                validating={journalposterResponse.isValidating}
                onPageChange={setPageRequestDokumenter}
                {...journalposterResponse.pagination}
              />
            </SidebarPanel>
          </Tabs.Panel>
        </VStack>
      </Tabs>
    </>
  )
}

const DEFAULT_PAGE_REQUEST: PageRequest = { pageNumber: 1, pageSize: 5 }

function usePageRequest() {
  return useState<PageRequest>(DEFAULT_PAGE_REQUEST)
}

const ingenOppgaver: never[] = []

const oppgaveCols = [
  { ...oppgaveColumns.behandlingstema, filter: undefined },
  { ...oppgaveColumns.sakIdMedEksternFallback, sortKey: undefined },
  { ...oppgaveColumns.oppgavetypeÅpneOppgave, filter: undefined },
  { ...oppgaveColumns.behandlingstype, filter: undefined },
  { ...oppgaveColumns.ferdigstilt, sortKey: undefined },
]

const dokumentCols = [
  dokumentColumns.tittel,
  dokumentColumns.fagsakId,
  { ...dokumentColumns.journalpostId },
  { ...dokumentColumns.journalpostOpprettetTid, formatDate: true, width: 100 },
  {
    ...dokumentColumns.journalposttype,
    width: 50,
    filter: undefined,
    renderCell({ journalposttype }: Journalpost) {
      return journalposttypeTagKortere(journalposttype)
    },
  },
]
