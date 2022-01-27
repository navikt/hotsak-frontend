import React, { useState } from 'react'
import { Flex } from '../felleskomponenter/Flex'
import { Toast } from '../felleskomponenter/Toast'
import { IngenOppgaver } from './IngenOppgaver'
import { Kolonne, OppgaverTable } from './OppgaverTable'
import { useOppgaveliste } from './oppgavelisteHook'
import { Panel, Table, SortState } from '@navikt/ds-react'
import { Pagination } from './paging/Pagination'
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
  SortOrder,
} from '../types/types.internal'
import { FilterDropdown, Filters } from './filter'
import { LinkRow } from '../felleskomponenter/table/LinkRow'

export const Oppgaveliste = () => {
  const [sakerFilter, setSakerFilter] = useState(SakerFilter.UFORDELTE)
  const [statusFilter, setStatusFilter] = useState(OppgaveStatusType.ALLE)
  const [områdeFilter, setOmrådeFilter] = useState(OmrådeFilter.ALLE)
  const [currentPage, setCurrentPage] = useState(1)
  const [sort, setSort] = useState<SortState>({ orderBy: Kolonne.MOTTATT, direction: 'descending' })
  //const [sortBy, setSortBy] = useState({ label: , sortOrder: SortOrder.DESCENDING })
  const { oppgaver, isError, isLoading, totalCount, mutate } = useOppgaveliste(currentPage, sort, {
    sakerFilter,
    statusFilter,
    områdeFilter,
  })

const handleSort = (sortolinen: SortState) => {
    console.log("Jau", sortolinen);
    
}

  /*const handleSort = (label: Kolonne, sortOrder: SortOrder) => {
    if (label !== sortBy.label) {
      setSortBy({ label, sortOrder: SortOrder.DESCENDING })
    } else {
      setSortBy({ label, sortOrder })
    }
    setCurrentPage(1)
  }*/

  const handleFilter = (handler: Function, value: SakerFilter | OppgaveStatusType | OmrådeFilter) => {
    handler(value)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSakerFilter(SakerFilter.UFORDELTE)
    setStatusFilter(OppgaveStatusType.ALLE)
    setOmrådeFilter(OmrådeFilter.ALLE)
    setCurrentPage(1)
  }

  const kolonner = [
    { key: Kolonne.EIER, name: 'Eier' },
    { key: Kolonne.STATUS, name: 'Status' },
    { key: Kolonne.FUNKSJONSNEDSETTELSE, name: 'Område' },
    { key: Kolonne.SØKNAD_OM, name: 'Søknad om' },
    { key: Kolonne.HJELPEMIDDELBRUKER, name: 'Hjelpemiddelbruker' },
    { key: Kolonne.FØDSELSNUMMER, name: 'Fødselsnr.' },
    { key: Kolonne.BOSTED, name: 'Bosted' },
    { key: Kolonne.FORMIDLER, name: 'Formidler' },
    { key: Kolonne.MOTTATT, name: 'Mottatt dato' },
  ]

  if (isError) {
    throw Error('Feil med henting av oppgaver')
  }

  console.log("Sort", sort);
  

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
        <Flex style={{ height: '100%' }}>
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
                <Pagination
                  totalCount={totalCount}
                  currentPage={currentPage}
                  onChangePage={(page: number) => setCurrentPage(page)}
                />

                {/* @ts-ignore */}
                <Table zebraStripes size="small" sort={sort} onSortChange={setSort}>
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
                          <Table.DataCell>
                            <Tildeling oppgave={oppgave} />
                          </Table.DataCell>
                        }
                        <Table.DataCell>
                          <Status status={OppgaveStatusLabel.get(oppgave.status)!} saksID={oppgave.saksid} />
                        </Table.DataCell>
                        <Table.DataCell>
                          <Funksjonsnedsettelse
                            funksjonsnedsettelser={oppgave.personinformasjon.funksjonsnedsettelse}
                            saksID={oppgave.saksid}
                          />
                        </Table.DataCell>
                        <Table.DataCell>
                          <Gjelder søknadOm={capitalize(oppgave.søknadOm)} saksID={oppgave.saksid} />
                        </Table.DataCell>
                        <Table.DataCell>
                          <Hjelpemiddelbruker person={oppgave.personinformasjon} saksID={oppgave.saksid} />
                        </Table.DataCell>
                        <Table.DataCell>
                          <Fødselsnummer fødselsnummer={oppgave.personinformasjon.fnr} />
                        </Table.DataCell>
                        <Table.DataCell>
                          <Bosted bosted={oppgave.personinformasjon.poststed} saksID={oppgave.saksid} />
                        </Table.DataCell>
                        <Table.DataCell>
                          <FormidlerCelle
                            saksID={oppgave.saksid}
                            formidlerNavn={oppgave.formidlerNavn}
                          ></FormidlerCelle>
                        </Table.DataCell>
                        <Table.DataCell>
                          <Motatt dato={oppgave.mottattDato} />
                        </Table.DataCell>
                        <Table.DataCell>
                          <MenyKnapp oppgave={oppgave} onMutate={mutate} />
                        </Table.DataCell>
                      </LinkRow>
                    ))}
                  </Table.Body>
                </Table>
              </>
            ) : (
              <IngenOppgaver />
            )}
          </Panel>
        </Flex>
      )}
    </>
  )
}

export default Oppgaveliste
