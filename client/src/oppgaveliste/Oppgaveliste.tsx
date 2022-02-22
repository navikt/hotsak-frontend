import React, { useState } from 'react'
import { Toast } from '../felleskomponenter/Toast'
import { IngenOppgaver } from './IngenOppgaver'
import styled from 'styled-components/macro'
import { useOppgaveliste } from './oppgavelisteHook'
import { Panel, Table, SortState } from '@navikt/ds-react'
import { Bosted } from './kolonner/Bosted'
import { Funksjonsnedsettelse } from './kolonner/Funksjonsnedsettelse'
import { Fødselsnummer } from './kolonner/Fødselsnummer'
import { Gjelder } from './kolonner/Gjelder'
import { Hjelpemiddelbruker } from './kolonner/Hjelpemiddelbruker'
import { Motatt } from './kolonner/Motatt'
import { Status } from './kolonner/Status'
import { Tildeling } from './kolonner/Tildeling'
import { capitalize } from '../utils/stringFormating'
import { FormidlerCelle } from './kolonner/Formidler'
import { MenyKnapp } from './kolonner/MenyKnapp'
import {
  OmrådeFilter,
  OmrådeFilterLabel,
  OppgaveStatusLabel,
  OppgaveStatusType,
  SakerFilter,
  SakerFilterLabel,
} from '../types/types.internal'
import { FilterDropdown, Filters } from './filter'
import { LinkRow } from '../felleskomponenter/table/LinkRow'
import { Paging } from './paging/Paging'

enum Kolonne {
  EIER = 'EIER',
  FØDSELSNUMMER = 'FØDSELSNUMMER',
  HJELPEMIDDELBRUKER = 'HJELPEMIDDELBRUKER',
  FUNKSJONSNEDSETTELSE = 'FUNKSJONSNEDSETTELSE',
  SØKNAD_OM = 'SØKNAD_OM',
  BOSTED = 'BOSTED',
  FORMIDLER = 'FORMIDLER',
  STATUS = 'STATUS',
  MOTTATT = 'MOTTATT',
}


export const Oppgaveliste = () => {
  const [sakerFilter, setSakerFilter] = useState(SakerFilter.UFORDELTE)
  const [statusFilter, setStatusFilter] = useState(OppgaveStatusType.ALLE)
  const [områdeFilter, setOmrådeFilter] = useState(OmrådeFilter.ALLE)
  const [currentPage, setCurrentPage] = useState(0)
  const [sort, setSort] = useState<SortState>({ orderBy: "mottatt", direction: 'ascending' })
  const { oppgaver, isError, isLoading, totalCount, mutate } = useOppgaveliste(currentPage, sort, {
    sakerFilter,
    statusFilter,
    områdeFilter,
  })

  const handleFilter = (handler: Function, value: SakerFilter | OppgaveStatusType | OmrådeFilter) => {
    handler(value)
    setCurrentPage(0)
  }

  const clearFilters = () => {
    setSakerFilter(SakerFilter.UFORDELTE)
    setStatusFilter(OppgaveStatusType.ALLE)
    setOmrådeFilter(OmrådeFilter.ALLE)
    setCurrentPage(0)
  }

  const Container = styled.div`
    min-height: 300px;
  `

  const ScrollableX = styled.div`
    overflow: auto hidden;
    margin: 0;
    padding: 0;
    height: calc(100% - 50px);
    width: 100%;
  `

  const kolonner = [
    { key: "eier", name: 'Eier' },
    { key: "status", name: 'Status' },
    { key: "funksjonsnedsettelse", name: 'Område' },
    { key: "søknadOm", name: 'Søknad om' },
    { key: "hjelpemiddelbruker", name: 'Hjelpemiddelbruker' },
    { key: "fødselsnummer", name: 'Fødselsnr.' },
    { key: "bosted", name: 'Kommune / bydel' },
    { key: "formidler", name: 'Formidler' },
    { key: "mottatt", name: 'Mottatt dato' },
  ]

  if (isError) {
    throw Error('Feil med henting av oppgaver')
  }

  //useLoadingToast({ isLoading: oppgaver.state === 'loading', message: 'Henter oppgaver' });
  const hasData = oppgaver && oppgaver.length > 0
  return (
    <>
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
          <ScrollableX>
            <Panel>
              {hasData ? (
                <>
                  {/*
                  <OppgaverTable
                    oppgaver={oppgaver}
                    sortBy={"sortBy"}
                    onSort={(label: Kolonne, sortOrder: SortOrder) => handleSort(label, sortOrder)}
                    onMutate={mutate}
                  />
                */}

                  <div style={{ overflow: 'auto' }}>
                    {/* @ts-ignore */}
                    <Table
                      style={{ width: 'initial' }}
                      zebraStripes
                      size="small"
                      sort={sort}
                      onSortChange={(sortKey) => {
                          console.log("Sort key: ", sortKey);
                          
                        setSort({
                          orderBy: "mottatt",
                          direction: sort?.direction === 'ascending' ? 'descending' : 'ascending',
                        })}
                      }
                    >
                      <Table.Header>
                        <Table.Row>
                          {kolonner.map(({ key, name }) => (
                            <Table.ColumnHeader key={key} sortable={true} sortKey={key}>
                              {name}
                            </Table.ColumnHeader>
                          ))}
                          <Table.HeaderCell scope="col" />
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {oppgaver.map((oppgave) => (
                          <LinkRow key={oppgave.saksid} saksnummer={oppgave.saksid}>
                            {
                              <Table.DataCell style={{ padding: '0.4rem' }}>
                                <Tildeling oppgave={oppgave} />
                              </Table.DataCell>
                            }
                            <Table.DataCell style={{ padding: '0.4rem' }}>
                              <Status status={OppgaveStatusLabel.get(oppgave.status)!} saksID={oppgave.saksid} />
                            </Table.DataCell>
                            <Table.DataCell style={{ padding: '0.4rem' }}>
                              <Funksjonsnedsettelse
                                funksjonsnedsettelser={oppgave.personinformasjon.funksjonsnedsettelse}
                                saksID={oppgave.saksid}
                              />
                            </Table.DataCell>
                            <Table.DataCell style={{ padding: '0.4rem' }}>
                              <Gjelder søknadOm={capitalize(oppgave.søknadOm)} saksID={oppgave.saksid} />
                            </Table.DataCell>
                            <Table.DataCell style={{ padding: '0.4rem' }}>
                              <Hjelpemiddelbruker person={oppgave.personinformasjon} saksID={oppgave.saksid} />
                            </Table.DataCell>
                            <Table.DataCell style={{ padding: '0.4rem' }}>
                              <Fødselsnummer fødselsnummer={oppgave.personinformasjon.fnr} />
                            </Table.DataCell>
                            <Table.DataCell style={{ padding: '0.4rem' }}>
                              <Bosted bosted={oppgave.personinformasjon.bosted} saksID={oppgave.saksid} />
                            </Table.DataCell>
                            <Table.DataCell style={{ padding: '0.4rem' }}>
                              <FormidlerCelle
                                saksID={oppgave.saksid}
                                formidlerNavn={oppgave.formidlerNavn}
                              ></FormidlerCelle>
                            </Table.DataCell>
                            <Table.DataCell style={{ padding: '0.4rem' }}>
                              <Motatt dato={oppgave.mottattDato} />
                            </Table.DataCell>
                            <Table.DataCell style={{ padding: '0.4rem' }}>
                              <MenyKnapp oppgave={oppgave} onMutate={mutate} />
                            </Table.DataCell>
                          </LinkRow>
                        ))}
                      </Table.Body>
                    </Table>

                    <Paging
                      totalCount={totalCount}
                      currentPage={currentPage}
                      onPageChange={(page: number) => setCurrentPage(page)}
                    />
                  </div>
                </>
              ) : (
                <IngenOppgaver />
              )}
            </Panel>
          </ScrollableX>
        </Container>
      )}
    </>
  )
}

export default Oppgaveliste
