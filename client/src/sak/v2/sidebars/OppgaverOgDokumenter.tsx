import { ChevronLeftIcon, ChevronRightIcon, PersonEnvelopeIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, HStack, Select, Tabs, VStack } from '@navikt/ds-react'
import { type ChangeEvent, useMemo, useState } from 'react'
import { useDokumentsøk } from '../../../dokument/useDokumentsøk'
import { DataGrid } from '../../../felleskomponenter/data/DataGrid'
import { type Oppgave } from '../../../oppgave/oppgaveTypes'
import { useOpppgavesøk } from '../../../oppgave/useOppgavesøk'
import { oppgaveColumns } from '../../../oppgaveliste/oppgaveColumns'
import { selectOppgaveId } from '../../../oppgaveliste/oppgaveSelectors'
import {
  dokumentColumns,
  journalpostKey,
  journalpoststatusTagKort,
  journalposttypeTagKort,
} from '../../../personoversikt/dokumentColumns'
import { useSak } from '../../../saksbilde/useSak'
import { Journalpost } from '../../../types/types.internal'
import { type IntervalString, intervalString } from '../../../utils/dato'
import { SidebarPanel, SidebarPanelBox, SidebarPanelHeading } from './SidebarPanel'
import { OppgaveDetailsSaksbilde } from './OppgaverDetailsSaksbilde'

const ingenOppgaver: Oppgave[] = []

const oppgaveCols = [
  { ...oppgaveColumns.behandlingstema, filter: undefined },
  { ...oppgaveColumns.sakId, sortKey: undefined },
  { ...oppgaveColumns.oppgavetypeÅpneOppgave, filter: undefined },
  { ...oppgaveColumns.behandlingstype, filter: undefined },
  { ...oppgaveColumns.ferdigstilt, sortKey: undefined },
]

const dokuCols = [
  { ...dokumentColumns.journalpostId, width: 50, header: 'ID' },
  {
    ...dokumentColumns.journalposttype,
    width: 50,
    renderCell: ({ journalposttype }: Journalpost) => journalposttypeTagKort(journalposttype),
  },
  { ...dokumentColumns.journalpostOpprettetTid, formatDate: true, width: 100 },
  dokumentColumns.tittel,
  dokumentColumns.dokumenter,
  {
    ...dokumentColumns.journalstatus,
    width: 50,
    renderCell: ({ journalstatus }: Journalpost) => journalpoststatusTagKort(journalstatus),
  },
  dokumentColumns.sakId,
]

export function OppgaverOgDokumenter() {
  const { sak } = useSak()
  const [currentTab, setCurrentTab] = useState<OppgaverOgDokumenterTab>(OppgaverOgDokumenterTabs.OPPGAVER)
  const [filter, setFilter] = useState<OppgaverOgDokumenterFilterValue>(OppgaverOgDokumenterFilter.SISTE_2_UKER)

  const fnr = sak?.data.bruker.fnr
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null])
  const etter = cursorHistory[cursorHistory.length - 1]
  const { journalposter, isLoading, sideInfo } = useDokumentsøk({ fnr, første: 5, etter: etter })
  const opprettetIntervall = useMemo(() => opprettetIntervallForFilter(filter), [filter])
  const oppgaverResponse = useOpppgavesøk({
    brukerId: fnr,
    sorteringsfelt: 'OPPRETTET_TIDSPUNKT',
    opprettetIntervall,
    sorteringsrekkefølge: 'DESC',
    pageNumber: 1,
    pageSize: 5,
  })

  const alleOppgaver = oppgaverResponse.data?.oppgaver ?? ingenOppgaver

  const nesteSide = () => {
    if (sideInfo?.finnesNesteSide && sideInfo.sluttpeker) {
      setCursorHistory((prev) => [...prev, sideInfo.sluttpeker])
    }
  }

  const forrigeSide = () => {
    setCursorHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }

  const sidenummer = cursorHistory.length
  const harForrigeSide = cursorHistory.length > 1
  const harNesteSide = sideInfo?.finnesNesteSide ?? false

  if (!sak) return null

  return (
    <>
      <SidebarPanelBox paddingBlock={'space-12'}>
        <SidebarPanelHeading
          tittel="Oppgaver og dokumenter"
          icon={<PersonEnvelopeIcon title="Oppgaver og dokumenter" />}
        />
      </SidebarPanelBox>

      <Tabs value={currentTab} size="small" onChange={(value) => setCurrentTab(value as OppgaverOgDokumenterTab)}>
        <VStack gap="space-12">
          <Tabs.List>
            <Tabs.Tab
              value={OppgaverOgDokumenterTabs.OPPGAVER}
              label={`Oppgaver (${oppgaverResponse.data?.totalElements})`}
            />
            <Tabs.Tab value={OppgaverOgDokumenterTabs.DOKUMENTER} label={`Dokumenter (${sideInfo?.totaltAntall})`} />
          </Tabs.List>

          <Box width="fit-content" paddingInline="space-8">
            <Select
              label="Tidsperiode"
              hideLabel
              size="small"
              value={filter}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setFilter(e.target.value as OppgaverOgDokumenterFilterValue)
              }
            >
              <option value={OppgaverOgDokumenterFilter.ALLE}>Vis alle</option>
              <option value={OppgaverOgDokumenterFilter.SISTE_2_UKER}>Siste 2 uker</option>
              <option value={OppgaverOgDokumenterFilter.SISTE_6_MND}>Siste 6 måneder</option>
            </Select>
          </Box>

          <Tabs.Panel value={OppgaverOgDokumenterTabs.OPPGAVER}>
            <SidebarPanel
              tittel=""
              error={oppgaverResponse.error && 'Feil ved henting av oppgaver.'}
              loading={oppgaverResponse.isLoading && 'Henter oppgaver ...'}
              spacing={false}
            >
              <DataGrid
                rows={alleOppgaver}
                columns={oppgaveCols}
                renderContent={OppgaveDetailsSaksbilde}
                keyFactory={selectOppgaveId}
                size="small"
                textSize="small"
                loading={oppgaverResponse.isLoading}
              />
            </SidebarPanel>
          </Tabs.Panel>

          <Tabs.Panel value={OppgaverOgDokumenterTabs.DOKUMENTER}>
            <SidebarPanel spacing={false} tittel="">
              <DataGrid
                rows={journalposter}
                columns={dokuCols}
                keyFactory={journalpostKey}
                size="small"
                textSize="small"
                loading={isLoading}
              />
              <HStack gap="space-8" align="center" justify="center" paddingBlock="space-8">
                <Button
                  size="small"
                  variant="tertiary"
                  icon={<ChevronLeftIcon />}
                  onClick={forrigeSide}
                  disabled={!harForrigeSide}
                >
                  Forrige
                </Button>
                <BodyShort size="small">Side {sidenummer}</BodyShort>
                <Button
                  size="small"
                  variant="tertiary"
                  icon={<ChevronRightIcon />}
                  iconPosition="right"
                  onClick={nesteSide}
                  disabled={!harNesteSide}
                >
                  Neste
                </Button>
              </HStack>
            </SidebarPanel>
          </Tabs.Panel>
        </VStack>
      </Tabs>
    </>
  )
}

export const OppgaverOgDokumenterTabs = {
  OPPGAVER: 'OPPGAVER',
  DOKUMENTER: 'DOKUMENTER',
} as const

export const OppgaverOgDokumenterFilter = {
  SISTE_2_UKER: 'siste2uker',
  SISTE_6_MND: 'siste6mnd',
  ALLE: 'alle',
} as const

export type OppgaverOgDokumenterFilterValue =
  (typeof OppgaverOgDokumenterFilter)[keyof typeof OppgaverOgDokumenterFilter]

function opprettetIntervallForFilter(filter: OppgaverOgDokumenterFilterValue): IntervalString | undefined {
  const now = new Date()
  switch (filter) {
    case OppgaverOgDokumenterFilter.SISTE_2_UKER: {
      const fra = new Date(now)
      fra.setDate(fra.getDate() - 14)
      return intervalString(fra.toISOString(), now.toISOString())
    }
    case OppgaverOgDokumenterFilter.SISTE_6_MND: {
      const fra = new Date(now)
      fra.setMonth(fra.getMonth() - 6)
      return intervalString(fra.toISOString(), now.toISOString())
    }
    case OppgaverOgDokumenterFilter.ALLE:
      return undefined
  }
}

export type OppgaverOgDokumenterTab = keyof typeof OppgaverOgDokumenterTabs

export interface OppgaverOgDokumenterState {
  currentTab: OppgaverOgDokumenterTab
  filter: (typeof OppgaverOgDokumenterFilter)[keyof typeof OppgaverOgDokumenterFilter]
}

export const initialState: OppgaverOgDokumenterState = {
  currentTab: OppgaverOgDokumenterTabs.OPPGAVER,
  filter: 'siste2uker',
}
