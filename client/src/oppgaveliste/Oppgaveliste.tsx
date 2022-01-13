import React, { useState } from 'react'
import { Flex } from '../felleskomponenter/Flex'
import { Toast } from '../felleskomponenter/Toast'
import { IngenOppgaver } from './IngenOppgaver'
import { Kolonne, OppgaverTable } from './OppgaverTable'
import { useOppgaveliste } from './oppgavelisteHook'
import { Panel } from '@navikt/ds-react'
import { Pagination } from './paging/Pagination'
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

export const Oppgaveliste = () => {
  const [sakerFilter, setSakerFilter] = useState(SakerFilter.UFORDELTE)
  const [statusFilter, setStatusFilter] = useState(OppgaveStatusType.ALLE)
  const [områdeFilter, setOmrådeFilter] = useState(OmrådeFilter.ALLE)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState({ label: Kolonne.MOTTATT, sortOrder: SortOrder.DESCENDING })
  const { oppgaver, isError, isLoading, totalCount, mutate } = useOppgaveliste(currentPage, sortBy, {
      sakerFilter,
      statusFilter,
      områdeFilter,
    },
  )

  const handleSort = (label: Kolonne, sortOrder: SortOrder) => {
    if (label !== sortBy.label) {
      setSortBy({ label, sortOrder: SortOrder.DESCENDING })
    } else {
      setSortBy({ label, sortOrder })
    }
    setCurrentPage(1)
  }

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
          label='Saker'
          value={sakerFilter}
          options={SakerFilterLabel}
        />
        <FilterDropdown
          handleChange={(filterValue: SakerFilter) => {
            handleFilter(setStatusFilter, filterValue)
          }}
          label='Status'
          value={statusFilter}
          options={OppgaveStatusLabel}
        />
        <FilterDropdown
          handleChange={(filterValue: SakerFilter) => {
            handleFilter(setOmrådeFilter, filterValue)
          }}
          label='Område'
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
                <OppgaverTable
                  oppgaver={oppgaver}
                  sortBy={sortBy}
                  onSort={(label: Kolonne, sortOrder: SortOrder) => handleSort(label, sortOrder)}
                  onMutate={mutate}
                />
                <Pagination
                  totalCount={totalCount}
                  currentPage={currentPage}
                  onChangePage={(page: number) => setCurrentPage(page)}
                />
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
