import React from 'react'
import styled from 'styled-components/macro'
import Panel from 'nav-frontend-paneler'

import { OppgaverTable } from './OppgaverTable'
import { StatusType } from '../types/types.internal'
import { Flex, FlexColumn } from '../felleskomponenter/Flex'
import { Tabs, TabType } from './tabs'
//import { useLoadingToast } from '../../hooks/useLoadingToast';
import { useInnloggetSaksbehandler } from '../state/authentication';
import { IngenOppgaver } from './IngenOppgaver'
import { useOppgaveliste } from './oppgavelisteHook'
import { Oppgave } from '../types/types.internal'

interface TabContextValue {
  aktivTab: TabType
  byttTab: Function
}

const TabContext = React.createContext<TabContextValue | undefined>(undefined)
TabContext.displayName = 'TabContext'

export function useTabContext() {
  const context = React.useContext(TabContext)

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

const Content = styled(Panel)`
  margin: 1.5rem;
  padding: 0;
  color: var(--navds-color-text-primary);
  overflow: auto hidden;
  box-sizing: border-box;
  flex: 1;
`

export const Oppgaveliste = () => {
  const { oppgaver, isError, isLoading } = useOppgaveliste()
  const [aktivTab, setAktivTab]: [TabType, Function] = React.useState<TabType>(TabType.Ufordelte)
  const byttTab = (nyTab: TabType) => setAktivTab(nyTab)
  const [filtrerteOppgaver, setFiltrerteOppgaver]: [Oppgave[], Function] = React.useState([])
  const saksbehandler = useInnloggetSaksbehandler()

  React.useEffect(() => {
        const filtrert =  oppgaver?.filter((oppgave) => {
        switch (aktivTab) {
          case TabType.Ufordelte:
            return !oppgave.saksbehandler && oppgave.status !== StatusType.OVERFØRT_GOSYS
          case TabType.OverførtGosys:
            return oppgave.status === StatusType.OVERFØRT_GOSYS
          case TabType.Mine:
            return oppgave?.saksbehandler?.objectId === saksbehandler.objectId
          default:
            return true
        }
      }) || []

    setFiltrerteOppgaver(filtrert)

  }, [aktivTab, oppgaver])

  if (isError) {
    throw Error('Feil med henting av oppgaver')
  }

  if (isLoading) {
    return <div>Her skal det komme en spinner. Eller kanskje den skal komme i stedet for tabellen?</div>
  }

  //useLoadingToast({ isLoading: oppgaver.state === 'loading', message: 'Henter oppgaver' });
  const hasData = filtrerteOppgaver.length > 0
  return (
    <Container>
      <FlexColumn>
        <TabContext.Provider value={{ aktivTab, byttTab }}>
          <Tabs />
          <Flex style={{ height: '100%' }}>
            <Content>{hasData ? <OppgaverTable oppgaver={filtrerteOppgaver} /> : <IngenOppgaver />}</Content>
          </Flex>
        </TabContext.Provider>
      </FlexColumn>
    </Container>
  )
}

export default Oppgaveliste
