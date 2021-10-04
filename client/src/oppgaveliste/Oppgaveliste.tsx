import React from 'react'
import styled from 'styled-components/macro'

import Panel from 'nav-frontend-paneler'

import { amplitude_taxonomy, logAmplitudeEvent } from '../utils/amplitude'
import { sorterKronologisk } from '../utils/date'

import { Flex, FlexColumn } from '../felleskomponenter/Flex'
import { Toast } from '../felleskomponenter/Toast'
import { useInnloggetSaksbehandler } from '../state/authentication'
import { Oppgave, OppgaveStatusType } from '../types/types.internal'
import { IngenOppgaver } from './IngenOppgaver'
import { OppgaverTable } from './OppgaverTable'
import { useOppgaveliste } from './oppgavelisteHook'
import { Tabs, TabType } from './tabs'

interface TabContextValue {
  aktivTab: TabType
  byttTab: (nyTab: TabType) => void
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
  const byttTab = (nyTab: TabType) => {
    setAktivTab(nyTab)
    logAmplitudeEvent(amplitude_taxonomy.OPPGAVELISTE_BYTT_TAB, { tab: nyTab })
  }
  const [filtrerteOppgaver, setFiltrerteOppgaver]: [Oppgave[], Function] = React.useState([])
  const saksbehandler = useInnloggetSaksbehandler()

  React.useEffect(() => {
    const filtrert =
      oppgaver
        ?.filter((oppgave) => {
          switch (aktivTab) {
            case TabType.Ufordelte:
              return oppgave.status === OppgaveStatusType.AVVENTER_SAKSBEHANDLER
            case TabType.OverførtGosys:
              return oppgave.status === OppgaveStatusType.SENDT_GOSYS
            case TabType.Mine:
              return oppgave?.saksbehandler?.objectId === saksbehandler.objectId
            default:
              return true
          }
        })
        .sort((a, b) => sorterKronologisk(a.mottattDato, b.mottattDato)) || []

    setFiltrerteOppgaver(filtrert)
  }, [aktivTab, oppgaver, saksbehandler.objectId])

  if (isError) {
    throw Error('Feil med henting av oppgaver')
  }

  if (isLoading) {
    return <Toast>Henter oppgaver </Toast>
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
