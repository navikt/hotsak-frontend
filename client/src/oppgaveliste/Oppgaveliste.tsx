import { Panel, SortState, Table } from '@navikt/ds-react'
import React from 'react'
import styled from 'styled-components'

import { DataCell, KolonneHeader } from '../felleskomponenter/table/KolonneHeader'
import { LinkRow } from '../felleskomponenter/table/LinkRow'
import { capitalize, capitalizeName, formatName, formaterFødselsnummer } from '../utils/stringFormating'
import { isError } from '../utils/type'

import { IngentingFunnet } from '../felleskomponenter/IngenOppgaver'
import { Toast } from '../felleskomponenter/Toast'
import { EllipsisCell, TekstCell } from '../felleskomponenter/table/Celle'
import { Skjermlesertittel } from '../felleskomponenter/typografi'
import {
  OmrådeFilter,
  OmrådeFilterLabel,
  Oppgave,
  OppgaveStatusLabel,
  OppgaveStatusType,
  SakerFilter,
  SakerFilterLabel,
  Sakstype,
  SakstypeFilter,
  SakstypeFilterLabel,
} from '../types/types.internal'
import { norskTimestamp } from '../utils/date'
import { OppgavelisteTabs } from './OppgavelisteTabs'
import { FilterDropdown, Filters } from './filter'
import { MenyKnapp } from './kolonner/MenyKnapp'
import { SakstypeEtikett } from './kolonner/SaksType'
import { useLocalStorageState } from './localStorage/localStorageHook'
import { useOppgaveliste } from './oppgavelisteHook'
import { Paging } from './paging/Paging'
import { Tildeling } from './kolonner/Tildeling'

const Container = styled.div`
  min-height: 300px;
  height: calc(100% - 50px);
  width: 100%;
`

const ScrollWrapper = styled.div`
  overflow: auto;
`

export const Oppgaveliste: React.FC = () => {
  const [sakerFilter, setSakerFilter] = useLocalStorageState('sakerFilter', SakerFilter.UFORDELTE)
  const [statusFilter, setStatusFilter] = useLocalStorageState('statusFilter', OppgaveStatusType.ALLE)
  const [områdeFilter, setOmrådeFilter] = useLocalStorageState('områdeFilter', OmrådeFilter.ALLE)
  const [sakstypeFilter, setSakstypeFilter] = useLocalStorageState('sakstypeFilter', SakstypeFilter.ALLE)
  const [currentPage, setCurrentPage] = useLocalStorageState('currentPage', 1)
  const [sort, setSort] = useLocalStorageState<SortState>('sortState', { orderBy: 'MOTTATT', direction: 'ascending' })

  const { oppgaver, isLoading, totalCount, error, mutate } = useOppgaveliste(currentPage, sort, {
    sakerFilter,
    statusFilter,
    sakstypeFilter,
    områdeFilter,
  })

  const handleFilter = (handler: (...args: any[]) => any, value: SakerFilter | OppgaveStatusType | OmrådeFilter) => {
    handler(value)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSakerFilter(SakerFilter.UFORDELTE)
    setStatusFilter(OppgaveStatusType.ALLE)
    setSakstypeFilter(SakstypeFilter.ALLE)
    setOmrådeFilter(OmrådeFilter.ALLE)
    setCurrentPage(1)
  }

  const kolonner = [
    { key: 'EIER', name: 'Eier', width: 152, render: (oppgave: Oppgave) => <Tildeling oppgave={oppgave} /> },
    {
      key: 'STATUS',
      name: 'Status',
      width: 154,
      render: (oppgave: Oppgave) => (
        <EllipsisCell minLength={18} value={OppgaveStatusLabel.get(oppgave.status) ?? ''} />
      ),
    },
    {
      key: 'TYPE',
      name: 'Type',
      width: 154,
      render: (oppgave: Oppgave) => <SakstypeEtikett sakstype={oppgave.sakstype} />,
    },
    {
      key: 'FUNKSJONSNEDSETTELSE',
      name: 'Område',
      width: 152,
      render: (oppgave: Oppgave) => (
        <EllipsisCell minLength={18} value={capitalize(oppgave.bruker.funksjonsnedsettelser.join(', '))} />
      ),
    },
    {
      key: 'SØKNAD_OM',
      name: 'Beskrivelse',
      width: 192,
      render: (oppgave: Oppgave) => (
        <EllipsisCell
          minLength={20}
          value={capitalize(oppgave.beskrivelse.replace('Søknad om:', '').replace('Bestilling av:', '').trim())}
        />
      ),
    },
    {
      key: 'HJELPEMIDDELBRUKER',
      name: 'Hjelpemiddelbruker',
      width: 188,
      render: (oppgave: Oppgave) => <EllipsisCell minLength={20} value={formatName(oppgave.bruker)} />,
    },
    {
      key: 'FØDSELSNUMMER',
      name: 'Fødselsnr.',
      width: 124,
      render: (oppgave: Oppgave) => <TekstCell value={formaterFødselsnummer(oppgave.bruker.fnr)} />,
    },
    {
      key: 'BOSTED',
      name: 'Kommune / bydel',
      width: 165,
      render: (oppgave: Oppgave) => <EllipsisCell minLength={18} value={oppgave.bruker.bosted} />,
    },
    {
      key: 'FORMIDLER',
      name: 'Innsender',
      width: 164,
      render: (oppgave: Oppgave) => <EllipsisCell minLength={19} value={capitalizeName(oppgave.innsender)} />,
    },
    {
      key: 'MOTTATT',
      name: 'Mottatt dato',
      width: 140,
      render: (oppgave: Oppgave) => <TekstCell value={norskTimestamp(oppgave.mottatt)} />,
    },
    {
      key: 'MENU',
      sortable: false,
      render: (oppgave: Oppgave) => (
        <MenyKnapp
          sakId={oppgave.sakId}
          status={oppgave.status}
          tildeltSaksbehandler={oppgave.saksbehandler}
          gåTilSak={true}
          sakstype={oppgave.sakstype}
          kanTildeles={oppgave.kanTildeles}
          onMutate={mutate}
        />
      ),
    },
  ]

  if (error) {
    if (isError(error)) {
      throw Error('Feil med henting av oppgaver', { cause: error })
    } else {
      throw Error('Feil med henting av oppgaver')
    }
  }

  const hasData = oppgaver && oppgaver.length > 0

  return (
    <>
      <Skjermlesertittel>Oppgaveliste</Skjermlesertittel>
      <OppgavelisteTabs />
      <Filters onClear={clearFilters}>
        <FilterDropdown
          handleChange={(filterValue: SakerFilter) => {
            handleFilter(setSakerFilter, filterValue)
          }}
          label="Saker"
          value={sakerFilter}
          options={SakerFilterLabel}
        />
        <FilterDropdown
          handleChange={(filterValue: SakerFilter) => {
            handleFilter(setStatusFilter, filterValue)
          }}
          label="Status"
          value={statusFilter}
          options={OppgaveStatusLabel}
        />
        {
          <FilterDropdown
            handleChange={(filterValue: SakerFilter) => {
              handleFilter(setSakstypeFilter, filterValue)
            }}
            label="Sakstype"
            value={sakstypeFilter}
            options={SakstypeFilterLabel}
          />
        }
        <FilterDropdown
          handleChange={(filterValue: SakerFilter) => {
            handleFilter(setOmrådeFilter, filterValue)
          }}
          label="Område"
          value={områdeFilter}
          options={OmrådeFilterLabel}
        />
      </Filters>

      {isLoading ? (
        <Toast>Henter oppgaver </Toast>
      ) : (
        <Container>
          <Panel>
            {hasData ? (
              <ScrollWrapper>
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
                      {kolonner.map(({ key, name, sortable = true, width }) => (
                        <KolonneHeader key={key} sortable={sortable} sortKey={key} width={width}>
                          {name}
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
                        {kolonner.map(({ render, width, key }) => (
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

                <Paging
                  totalCount={totalCount}
                  currentPage={currentPage}
                  onPageChange={(page: number) => setCurrentPage(page)}
                />
              </ScrollWrapper>
            ) : (
              <IngentingFunnet>Ingen saker funnet</IngentingFunnet>
            )}
          </Panel>
        </Container>
      )}
    </>
  )
}

export default Oppgaveliste
