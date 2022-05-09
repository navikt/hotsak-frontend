import React from 'react'
import styled from 'styled-components/macro'

import { Panel, Table } from '@navikt/ds-react'

import { DataCell, KolonneHeader } from '../felleskomponenter/table/KolonneHeader'
import { LinkRow } from '../felleskomponenter/table/LinkRow'
import { capitalize } from '../utils/stringFormating'
import { isError } from '../utils/type'

import { Toast } from '../felleskomponenter/Toast'
import { Skjermlesertittel } from '../felleskomponenter/typografi'
import {
  OmrådeFilter,
  OmrådeFilterLabel,
  Oppgave,
  OppgaveStatusLabel,
  OppgaveStatusType,
  SakerFilter,
  SakerFilterLabel,
  SakstypeFilter,
  SakstypeFilterLabel,
} from '../types/types.internal'
import { IngentingFunnet } from './IngenOppgaver'
import { FilterDropdown, Filters } from './filter'
import { Bosted } from './kolonner/Bosted'
import { FormidlerCelle } from './kolonner/Formidler'
import { Funksjonsnedsettelse } from './kolonner/Funksjonsnedsettelse'
import { Fødselsnummer } from './kolonner/Fødselsnummer'
import { Gjelder } from './kolonner/Gjelder'
import { Hjelpemiddelbruker } from './kolonner/Hjelpemiddelbruker'
import { MenyKnapp } from './kolonner/MenyKnapp'
import { Motatt } from './kolonner/Motatt'
import { OppgaveType } from './kolonner/OpgaveType'
import { Status } from './kolonner/Status'
import { Tildeling } from './kolonner/Tildeling'
import { useLocalStorageState } from './localStorage/localStorageHook'
import { useOppgaveliste } from './oppgavelisteHook'
import { Paging } from './paging/Paging'

const Container = styled.div`
  min-height: 300px;
  height: calc(100% - 50px);
  width: 100%;
`

const ScrollWrapper = styled.div`
  overflow: auto;
`

export const Oppgaveliste: React.VFC = () => {
  const [sakerFilter, setSakerFilter] = useLocalStorageState('sakerFilter', SakerFilter.UFORDELTE)
  const [statusFilter, setStatusFilter] = useLocalStorageState('statusFilter', OppgaveStatusType.ALLE)
  const [områdeFilter, setOmrådeFilter] = useLocalStorageState('områdeFilter', OmrådeFilter.ALLE)
  const [sakstypeFilter, setSakstypeFilter] = useLocalStorageState('sakstypeFilter', SakstypeFilter.ALLE)
  const [currentPage, setCurrentPage] = useLocalStorageState('currentPage', 1)
  const [sort, setSort] = useLocalStorageState('sortState', { orderBy: 'MOTTATT', direction: 'ascending' })

  const { oppgaver, isLoading, totalCount, error, mutate } = useOppgaveliste(currentPage, sort, {
    sakerFilter,
    statusFilter,
    sakstypeFilter,
    områdeFilter,
  })

  const handleFilter = (handler: Function, value: SakerFilter | OppgaveStatusType | OmrådeFilter) => {
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
      render: (oppgave: Oppgave) => <Status status={OppgaveStatusLabel.get(oppgave.status)!} saksID={oppgave.saksid} />,
    },
    {
      key: 'TYPE',
      name: 'Type',
      width: 154,
      render: (oppgave: Oppgave) => <OppgaveType oppgaveType={oppgave.type} />,
    },
    {
      key: 'FUNKSJONSNEDSETTELSE',
      name: 'Område',
      width: 152,
      render: (oppgave: Oppgave) => (
        <Funksjonsnedsettelse
          funksjonsnedsettelser={oppgave.personinformasjon.funksjonsnedsettelse}
          saksID={oppgave.saksid}
        />
      ),
    },
    {
      key: 'SØKNAD_OM',
      name: 'Søknad om',
      width: 192,
      render: (oppgave: Oppgave) => <Gjelder søknadOm={capitalize(oppgave.søknadOm)} saksID={oppgave.saksid} />,
    },
    {
      key: 'HJELPEMIDDELBRUKER',
      name: 'Hjelpemiddelbruker',
      width: 188,
      render: (oppgave: Oppgave) => <Hjelpemiddelbruker person={oppgave.personinformasjon} saksID={oppgave.saksid} />,
    },
    {
      key: 'FØDSELSNUMMER',
      name: 'Fødselsnr.',
      width: 124,
      render: (oppgave: Oppgave) => <Fødselsnummer fødselsnummer={oppgave.personinformasjon.fnr} />,
    },
    {
      key: 'BOSTED',
      name: 'Kommune / bydel',
      width: 165,
      render: (oppgave: Oppgave) => <Bosted bosted={oppgave.personinformasjon.bosted} saksID={oppgave.saksid} />,
    },
    {
      key: 'FORMIDLER',
      name: 'Formidler',
      width: 164,
      render: (oppgave: Oppgave) => <FormidlerCelle saksID={oppgave.saksid} formidlerNavn={oppgave.formidlerNavn} />,
    },
    {
      key: 'MOTTATT',
      name: 'Mottatt dato',
      width: 140,
      render: (oppgave: Oppgave) => <Motatt dato={oppgave.mottattDato} />,
    },
    { key: 'MENU', sortable: false, render: (oppgave: Oppgave) => <MenyKnapp oppgave={oppgave} onMutate={mutate} /> },
  ]

  if (error) {
    if (isError(error)) {
      throw Error('Feil med henting av oppgaver', { cause: error })
    } else {
      throw Error('Feil med henting av oppgaver')
    }
  }

  //useLoadingToast({ isLoading: oppgaver.state === 'loading', message: 'Henter oppgaver' });
  const hasData = oppgaver && oppgaver.length > 0
  return (
    <>
      <Skjermlesertittel>Oppgaveliste</Skjermlesertittel>
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
        {window.appSettings.MILJO !== 'prod-gcp' && (
          <FilterDropdown
            handleChange={(filterValue: SakerFilter) => {
              handleFilter(setSakstypeFilter, filterValue)
            }}
            label="Sakstype"
            value={sakstypeFilter}
            options={SakstypeFilterLabel}
          />
        )}
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
                      orderBy: sortKey || 'mottatt',
                      direction: sort?.direction === 'ascending' ? 'descending' : 'ascending',
                    })
                  }}
                >
                  <Table.Header>
                    <Table.Row>
                      {kolonner
                        // Toggle for at oppsett for bestillingsordning kun skal vises i labs
                        .filter(({ key }) => (window.appSettings.MILJO !== 'prod-gcp' ? true : key !== 'TYPE'))
                        .map(({ key, name, sortable = true, width }, idx) => (
                          <KolonneHeader key={key} sortable={sortable} sortKey={key} width={width}>
                            {name}
                          </KolonneHeader>
                        ))}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {oppgaver.map((oppgave) => (
                      <LinkRow key={oppgave.saksid} oppgaveType={oppgave.type} saksnummer={oppgave.saksid}>
                        {kolonner
                          // Toggle for at oppsett for bestillingsordning kun skal vises i labs
                          .filter(({ key }) => (window.appSettings.MILJO !== 'prod-gcp' ? true : key !== 'TYPE'))
                          .map(({ render, width, key }, idx) => (
                            <DataCell
                              key={key}
                              width={width}
                              style={{
                                padding: 'var(--navds-spacing-1) 0rem var(--navds-spacing-1) var(--navds-spacing-3)',
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
