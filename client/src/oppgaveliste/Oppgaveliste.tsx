import { Box, Button, HStack, SortState, Table, Tag } from '@navikt/ds-react'
import styled from 'styled-components'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { IngentingFunnet } from '../felleskomponenter/IngenOppgaver'
import { EllipsisCell, TekstCell } from '../felleskomponenter/table/Celle'
import { DataCell, KolonneHeader } from '../felleskomponenter/table/KolonneHeader'
import { LinkRow } from '../felleskomponenter/table/LinkRow'
import type { Tabellkolonne } from '../felleskomponenter/table/Tabellkolonne'
import { Toast } from '../felleskomponenter/Toast'
import { Skjermlesertittel } from '../felleskomponenter/typografi'
import { TildelingKonfliktModal } from '../saksbilde/TildelingKonfliktModal.tsx'
import {
  OmrådeFilter,
  OmrådeFilterLabel,
  Oppgave,
  OppgaveStatusLabel,
  OppgaveStatusType,
  SakerFilter,
  Sakstype,
  SakstypeFilter,
  SakstypeFilterLabel,
  Statuskategori,
} from '../types/types.internal'
import { formaterTidsstempel } from '../utils/dato'
import { formaterFødselsnummer, formaterNavn, storForbokstavIAlleOrd, storForbokstavIOrd } from '../utils/formater'
import { isError } from '../utils/type'
import { FilterDropdown, FilterToggle } from './filter/filter.tsx'
import { MenyKnapp } from './kolonner/MenyKnapp'
import { SakstypeEtikett } from './kolonner/SakstypeEtikett'
import { Tildeling } from './kolonner/Tildeling'
import { OppgavelisteTabs } from './OppgavelisteTabs'
import { useLocalState } from '../state/useLocalState'
import { OppgavelisteFilters, OppgavelisteFiltersKey, useOppgaveliste } from './useOppgaveliste'
import { useOppgaveStatusLabel } from './useOppgaveStatusLabel.ts'
import { useSakerFilterLabel } from './useSakerFilterLabel.ts'
import { useOppgavetilgang } from './useOppgavetilgang.ts'
import { useErKunTilbehørPilot } from '../tilgang/useTilgang.ts'
import { Paginering } from '../felleskomponenter/Paginering.tsx'

const defaultFilterState: OppgavelisteFilters & { currentPage: number } = {
  statuskategori: Statuskategori.ÅPEN,
  sakerFilter: SakerFilter.UFORDELTE,
  statusFilter: OppgaveStatusType.ALLE,
  sakstypeFilter: SakstypeFilter.ALLE,
  områdeFilter: OmrådeFilter.ALLE,
  hasteToggle: false,
  currentPage: 1,
}

export function Oppgaveliste() {
  const [filterState, setFilterState] = useLocalState<OppgavelisteFilters & { currentPage: number }>(
    'filterState',
    defaultFilterState
  )
  const [sort, setSort] = useLocalState<SortState>('sortState', { orderBy: 'MOTTATT', direction: 'ascending' })

  const navigate = useNavigate()
  const { harSkrivetilgang } = useOppgavetilgang()
  const [visTildelingKonfliktModalForSak, setVisTildelingKonfliktModalForSak] = useState<string | undefined>(undefined)

  const { currentPage, ...filters } = filterState
  const { oppgaver, pageNumber, pageSize, totalElements, antallHaster, isLoading, error, mutate } = useOppgaveliste(
    currentPage,
    sort,
    filters
  )

  const handleFilter = (key: OppgavelisteFiltersKey, value: OppgavelisteFilters[OppgavelisteFiltersKey]) => {
    setFilterState({ ...filterState, currentPage: 1, [key]: value })
  }

  const clearFilters = () => {
    setFilterState(defaultFilterState)
  }

  const sakerFilterLabel = useSakerFilterLabel(filterState.statuskategori)
  const oppgaveStatusLabel = useOppgaveStatusLabel(filterState.statuskategori)
  const erPilotKunTilbehør = useErKunTilbehørPilot()

  const kolonner: ReadonlyArray<Tabellkolonne<Oppgave>> = [
    {
      key: 'EIER',
      name: 'Eier',
      width: 155,
      render(oppgave) {
        return (
          <Tildeling
            oppgave={oppgave}
            lesevisning={!harSkrivetilgang}
            visTildelingKonfliktModalForSak={setVisTildelingKonfliktModalForSak}
            onMutate={mutate}
          />
        )
      },
    },
    {
      key: 'STATUS',
      name: 'Status',
      width: 155,
      render(oppgave) {
        return <EllipsisCell minLength={18} value={OppgaveStatusLabel.get(oppgave.status) ?? ''} />
      },
    },
    {
      key: 'TYPE',
      name: 'Type',
      width: 115,
      render(oppgave) {
        return <SakstypeEtikett sakstype={oppgave.sakstype} />
      },
    },
    {
      key: 'FUNKSJONSNEDSETTELSE',
      name: 'Område',
      width: 155,
      render(oppgave) {
        return (
          <EllipsisCell
            minLength={18}
            value={storForbokstavIAlleOrd(oppgave.bruker.funksjonsnedsettelser.join(', '))}
          />
        )
      },
    },
    {
      key: 'HAST',
      width: 105,
      header() {
        return (
          <>
            {antallHaster > 0 && (
              <Tag variant="warning-moderate" size="xsmall">
                {antallHaster}
              </Tag>
            )}
            Hast
          </>
        )
      },
      render({ hast }) {
        return (
          hast &&
          hast.årsaker.length > 0 && (
            <Tag variant="warning-moderate" size="xsmall">
              Haster
            </Tag>
          )
        )
      },
    },
    {
      key: 'SØKNAD_OM',
      name: 'Beskrivelse',
      width: 205,
      render(oppgave) {
        return (
          <EllipsisCell
            minLength={20}
            value={storForbokstavIOrd(
              oppgave.beskrivelse.replace('Søknad om:', '').replace('Bestilling av:', '').trim()
            )}
          />
        )
      },
    },
    {
      key: 'HJELPEMIDDELBRUKER',
      name: 'Hjelpemiddelbruker',
      width: 200,
      render(oppgave) {
        return <EllipsisCell minLength={20} value={formaterNavn(oppgave.bruker)} />
      },
    },
    {
      key: 'FØDSELSNUMMER',
      name: 'Fødselsnr.',
      width: 125,
      render(oppgave) {
        return <TekstCell value={formaterFødselsnummer(oppgave.bruker.fnr)} />
      },
    },
    {
      key: 'BOSTED',
      name: 'Kommune / bydel',
      width: 180,
      render(oppgave) {
        return <EllipsisCell minLength={18} value={oppgave.bruker.bosted} />
      },
    },
    {
      key: 'FORMIDLER',
      name: 'Innsender',
      width: 165,
      render(oppgave) {
        return <EllipsisCell minLength={19} value={formaterNavn(oppgave.innsender)} />
      },
    },
    {
      key: 'MOTTATT',
      name: 'Mottatt dato',
      width: 140,
      render(oppgave) {
        return <TekstCell value={formaterTidsstempel(oppgave.mottatt)} />
      },
    },
    {
      key: 'MENU',
      sortable: false,
      hide: !harSkrivetilgang,
      render(oppgave) {
        return (
          <MenyKnapp
            sakId={oppgave.sakId}
            status={oppgave.status}
            tildeltSaksbehandler={oppgave.saksbehandler}
            gåTilSak={true}
            sakstype={oppgave.sakstype}
            kanTildeles={oppgave.kanTildeles}
            setKonfliktModalOpen={setVisTildelingKonfliktModalForSak}
            onMutate={mutate}
          />
        )
      },
    },
  ]

  const hentOmrådeFilterLabel = (erPilotKunTilbehør: boolean) => {
    if (erPilotKunTilbehør) {
      OmrådeFilterLabel.set(OmrådeFilter.KOMMUNIKASJON, 'Kommunikasjon')
    }

    return OmrådeFilterLabel
  }

  if (error) {
    if (isError(error)) {
      throw Error('Feil med henting av oppgaver', { cause: error })
    } else {
      throw Error('Feil med henting av oppgaver')
    }
  }

  const hasData = oppgaver && oppgaver.length > 0

  const filterHide = ({ hide }: Tabellkolonne<Oppgave>): boolean => hide !== true

  return (
    <>
      <title>Hotsak - Oppgaveliste</title>
      <Skjermlesertittel>Oppgaveliste</Skjermlesertittel>
      <OppgavelisteTabs />

      <Box padding="4">
        <HStack gap="4" align="end">
          <FilterDropdown
            handleChange={(filterValue: SakerFilter) => {
              handleFilter('sakerFilter', filterValue)
            }}
            label="Saker"
            value={filterState.sakerFilter}
            options={sakerFilterLabel}
          />
          <FilterDropdown
            handleChange={(filterValue: OppgaveStatusType) => {
              handleFilter('statusFilter', filterValue)
            }}
            label="Status"
            value={filterState.statusFilter}
            options={oppgaveStatusLabel}
          />
          {
            <FilterDropdown
              handleChange={(filterValue: SakstypeFilter) => {
                handleFilter('sakstypeFilter', filterValue)
              }}
              label="Sakstype"
              value={filterState.sakstypeFilter}
              options={SakstypeFilterLabel}
            />
          }
          <FilterDropdown
            handleChange={(filterValue: OmrådeFilter) => {
              handleFilter('områdeFilter', filterValue)
            }}
            label="Område"
            value={filterState.områdeFilter}
            options={hentOmrådeFilterLabel(erPilotKunTilbehør)}
          />
          <FilterToggle
            handleChange={(filterValue: boolean) => {
              handleFilter('hasteToggle', filterValue)
            }}
            label="Kun hastesaker"
            value={filterState.hasteToggle}
          />
          <FilterToggle
            handleChange={(filterValue: boolean) => {
              const statuskategori = filterValue ? Statuskategori.AVSLUTTET : Statuskategori.ÅPEN
              setFilterState({
                ...filterState,
                statuskategori,
                sakerFilter:
                  statuskategori === Statuskategori.AVSLUTTET && filterState.sakerFilter == SakerFilter.UFORDELTE
                    ? SakerFilter.ALLE
                    : filterState.sakerFilter,
                statusFilter: OppgaveStatusType.ALLE,
                currentPage: 1,
              })
            }}
            label="Kun ferdigstilte"
            value={filterState.statuskategori === Statuskategori.AVSLUTTET}
          />
          <Button variant="tertiary-neutral" size="small" onClick={() => clearFilters()}>
            Tilbakestill filtre
          </Button>
        </HStack>
      </Box>
      {isLoading ? (
        <Toast>Henter oppgaver </Toast>
      ) : (
        <Container>
          <Box padding="4">
            {hasData ? (
              <>
                <Table
                  style={{ width: 'initial' }}
                  zebraStripes
                  size="small"
                  sort={sort}
                  onSortChange={(sortKey) => {
                    setSort({
                      orderBy: sortKey || 'MOTTATT',
                      direction: sort?.direction === 'ascending' ? 'descending' : 'ascending',
                    })
                  }}
                >
                  <caption className="sr-only">Oppgaveliste</caption>
                  <Table.Header>
                    <Table.Row>
                      {kolonner.filter(filterHide).map(({ key, name, width, sortable = true, header }) => (
                        <KolonneHeader key={key} sortable={sortable} sortKey={key} width={width}>
                          {header ? header() : name}
                        </KolonneHeader>
                      ))}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {oppgaver.map((oppgave) => (
                      <LinkRow
                        key={oppgave.sakId}
                        path={
                          oppgave.sakstype !== Sakstype.TILSKUDD
                            ? `/sak/${oppgave.sakId}/hjelpemidler`
                            : `/sak/${oppgave.sakId}`
                        }
                      >
                        {kolonner.filter(filterHide).map(({ key, width, render }) => (
                          <DataCell
                            key={key}
                            width={width}
                            style={{
                              padding: 'var(--a-spacing-1) 0rem var(--a-spacing-1) var(--a-spacing-3)',
                            }}
                          >
                            {render(oppgave)}
                          </DataCell>
                        ))}
                      </LinkRow>
                    ))}
                  </Table.Body>
                </Table>
                <Paginering
                  pageNumber={pageNumber}
                  pageSize={pageSize}
                  totalElements={totalElements}
                  tekst="oppgaver"
                  onPageChange={(page) => setFilterState({ ...filterState, currentPage: page })}
                />
                <TildelingKonfliktModal
                  open={!!visTildelingKonfliktModalForSak}
                  onClose={() => setVisTildelingKonfliktModalForSak(undefined)}
                  onPrimaryAction={() => {
                    if (visTildelingKonfliktModalForSak) navigate(visTildelingKonfliktModalForSak)
                  }}
                />
              </>
            ) : (
              <IngentingFunnet>Ingen saker funnet.</IngentingFunnet>
            )}
          </Box>
        </Container>
      )}
    </>
  )
}

const Container = styled.div`
  min-height: 300px;
  height: calc(100% - 50px);
  width: 100%;
  overflow: auto;
`

export default Oppgaveliste
