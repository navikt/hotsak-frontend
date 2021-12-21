import React, { useState, useContext } from 'react'
import styled from 'styled-components/macro'

import { amplitude_taxonomy, logAmplitudeEvent } from '../utils/amplitude'

import { Flex, FlexColumn } from '../felleskomponenter/Flex'
import { Toast } from '../felleskomponenter/Toast'
import { IngenOppgaver } from './IngenOppgaver'
import { Kolonne, OppgaverTable } from './OppgaverTable'
import { useOppgaveliste } from './oppgavelisteHook'
import { Tabs, TabType } from './tabs'
import { Panel } from '@navikt/ds-react'
import { Pagination } from './paging/Pagination'
import { SortOrder } from '../types/types.internal'

interface TabContextValue {
  aktivTab: TabType
  byttTab: (nyTab: TabType) => void
}

const TabContext = React.createContext<TabContextValue | undefined>(undefined)
TabContext.displayName = 'TabContext'

export function useTabContext() {
  const context = useContext(TabContext)

  if (context === undefined) {
    throw Error('Must be used in a TabContext ')
  }

  return context
}

const Container = styled.div`
  position: relative;
  flex: 1;
  overflow-x: hidden;
`

export const Oppgaveliste = () => {
  const [aktivTab, setAktivTab] = useState(TabType.Ufordelte)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState({label: Kolonne.MOTTATT, sortOrder: SortOrder.DESCENDING })
  const { oppgaver, isError, isLoading, totalCount } = useOppgaveliste(aktivTab, currentPage, sortBy)

const handleSort = (label: Kolonne, sortOrder: SortOrder) => {
    if(label !== sortBy.label) {
        setSortBy({label, sortOrder: SortOrder.DESCENDING})
    } else {
        setSortBy({label, sortOrder})
    }
    
}

  const byttTab = (nyTab: TabType) => {
    setAktivTab(nyTab)
    setCurrentPage(1)
    logAmplitudeEvent(amplitude_taxonomy.OPPGAVELISTE_BYTT_TAB, { tab: nyTab })
  }

  if (isError) {
    throw Error('Feil med henting av oppgaver')
  }

  //useLoadingToast({ isLoading: oppgaver.state === 'loading', message: 'Henter oppgaver' });
  const hasData = oppgaver && oppgaver.length > 0
  return (
    <Container>
      <FlexColumn>
        <TabContext.Provider value={{ aktivTab, byttTab }}>
          <Tabs />
          {isLoading ? (
            <Toast>Henter oppgaver </Toast>
          ) : (
            <Flex style={{ height: '100%' }}>
              <Panel>
                {hasData ? (
                  <>
                    <OppgaverTable oppgaver={oppgaver} sortBy={sortBy} onSort={(label: Kolonne, sortOrder: SortOrder) => handleSort(label, sortOrder)} />
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
        </TabContext.Provider>
      </FlexColumn>
    </Container>
  )
}

export default Oppgaveliste
