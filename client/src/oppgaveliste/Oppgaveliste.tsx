import React, { useState, useContext } from 'react'
import styled from 'styled-components/macro'

import { amplitude_taxonomy, logAmplitudeEvent } from '../utils/amplitude'

import { Flex, FlexColumn } from '../felleskomponenter/Flex'
import { Toast } from '../felleskomponenter/Toast'
import { IngenOppgaver } from './IngenOppgaver'
import { OppgaverTable } from './OppgaverTable'
import { useOppgaveliste } from './oppgavelisteHook'
import { Tabs, TabType } from './tabs'
import { Panel } from '@navikt/ds-react'

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
  const { oppgaver, isError, isLoading } = useOppgaveliste(aktivTab)

  

  const byttTab = (nyTab: TabType) => {
    setAktivTab(nyTab)
    logAmplitudeEvent(amplitude_taxonomy.OPPGAVELISTE_BYTT_TAB, { tab: nyTab })
  }

  if (isError) {
    throw Error('Feil med henting av oppgaver')
  }

  if (isLoading) {
    return <Toast>Henter oppgaver </Toast>
  }

  //useLoadingToast({ isLoading: oppgaver.state === 'loading', message: 'Henter oppgaver' });
  const hasData = oppgaver && oppgaver.length > 0
  return (
    <Container>
      <FlexColumn>
        <TabContext.Provider value={{ aktivTab, byttTab }}>
          <Tabs />
          <Flex style={{ height: '100%' }}>
            <Panel>{hasData ? <OppgaverTable oppgaver={oppgaver} /> : <IngenOppgaver />}</Panel>
          </Flex>
        </TabContext.Provider>
      </FlexColumn>
    </Container>
  )
}

export default Oppgaveliste
