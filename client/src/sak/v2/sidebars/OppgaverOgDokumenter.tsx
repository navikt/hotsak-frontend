import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, HStack, Select, Tabs, VStack } from '@navikt/ds-react'
import { type ChangeEvent, useMemo, useState } from 'react'
import { useDokumentsøk } from '../../../dokument/useDokumentsøk'
import { DataGrid } from '../../../felleskomponenter/data/DataGrid'
import { type Oppgave } from '../../../oppgave/oppgaveTypes'
import { useOpppgavesøk } from '../../../oppgave/useOppgavesøk'
import { oppgaveColumns } from '../../../oppgaveliste/oppgaveColumns'
import { selectOppgaveId } from '../../../oppgaveliste/oppgaveSelectors'
import { dokumentColumns, journalpostKey, journalposttypeTagKortere } from '../../../personoversikt/dokumentColumns'
import { useSak } from '../../../saksbilde/useSak'
import { Journalpost } from '../../../types/types.internal'
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

const ingenOppgaver: Oppgave[] = []

const oppgaveCols = [
  { ...oppgaveColumns.behandlingstema, filter: undefined },
  { ...oppgaveColumns.sakId, sortKey: undefined },
  { ...oppgaveColumns.oppgavetypeÅpneOppgave, filter: undefined },
  { ...oppgaveColumns.behandlingstype, filter: undefined },
  { ...oppgaveColumns.ferdigstilt, sortKey: undefined },
]

const dokuCols = [
  dokumentColumns.tittelMedLink,
  dokumentColumns.sakIdKunTekst,
  { ...dokumentColumns.journalpostId },
  { ...dokumentColumns.journalpostOpprettetTid, formatDate: true, width: 100 },
  {
    ...dokumentColumns.journalposttype,
    width: 50,
    renderCell: ({ journalposttype }: Journalpost) => journalposttypeTagKortere(journalposttype),
  },
]

export function OppgaverOgDokumenter() {
  const { sak } = useSak()
  const [currentTab, setCurrentTab] = useState<OppgaverOgDokumenterTab>(OppgaverOgDokumenterTabs.OPPGAVER)
  const [filter, setFilter] = useState<OppgaverOgDokumenterFilterValue>(OppgaverOgDokumenterFilter.SISTE_2_UKER)

  const fnr = sak?.data.bruker.fnr
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null])
  const etter = cursorHistory[cursorHistory.length - 1]
  const { fraDato, tilDato } = useMemo(() => datoIntervallForFilter(filter), [filter])
  const { journalposter, isValidating, isLoading, sideInfo, error } = useDokumentsøk({
    fnr,
    første: 5,
    etter,
    fraDato,
    tilDato,
    keepPreviousData: true,
  })
  const opprettetIntervall = useMemo(() => opprettetIntervallForFilter(filter), [filter])
  const [oppgaverPageNumber, setOppgaverPageNumber] = useState(1)
  const oppgaverResponse = useOpppgavesøk(
    {
      brukerId: fnr,
      sorteringsfelt: 'OPPRETTET_TIDSPUNKT',
      opprettetIntervall,
      sorteringsrekkefølge: 'DESC',
      pageNumber: oppgaverPageNumber,
      pageSize: 5,
    },
    true
  )

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

  const harForrigeOppgaveSide = oppgaverPageNumber > 1
  const harNesteOppgaveSide = oppgaverPageNumber < (oppgaverResponse.data?.totalPages ?? 1)

  if (!sak) return null

  return (
    <>
      <SidebarPanelBox paddingBlock={'space-12'}>
        <SidebarPanelHeading tittel="Oppgaver og dokumenter" />
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
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setFilter(e.target.value as OppgaverOgDokumenterFilterValue)
                setCursorHistory([null])
                setOppgaverPageNumber(1)
              }}
            >
              <option value={OppgaverOgDokumenterFilter.ALLE}>Vis alle</option>
              <option value={OppgaverOgDokumenterFilter.SISTE_2_UKER}>Siste 2 uker</option>
              <option value={OppgaverOgDokumenterFilter.SISTE_6_MND}>Siste 6 måneder</option>
            </Select>
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
              />
            </SidebarPanel>
            <HStack gap="space-8" align="center" justify="center" paddingBlock="space-8">
              <Button
                size="small"
                variant="tertiary"
                icon={<ChevronLeftIcon />}
                onClick={() => setOppgaverPageNumber((prev) => prev - 1)}
                disabled={!harForrigeOppgaveSide}
              >
                Forrige
              </Button>
              <BodyShort size="small">Side {oppgaverPageNumber}</BodyShort>
              <Button
                size="small"
                variant="tertiary"
                icon={<ChevronRightIcon />}
                iconPosition="right"
                onClick={() => setOppgaverPageNumber((prev) => prev + 1)}
                disabled={!harNesteOppgaveSide}
              >
                Neste
              </Button>
            </HStack>
          </Tabs.Panel>

          <Tabs.Panel value={OppgaverOgDokumenterTabs.DOKUMENTER}>
            <SidebarPanel spacing={false} tittel="" error={error && 'Feil ved henting av dokumenter.'}>
              <DataGrid
                rows={journalposter}
                columns={dokuCols}
                keyFactory={journalpostKey}
                size="small"
                textSize="small"
                loading={isLoading}
                validating={isValidating}
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
