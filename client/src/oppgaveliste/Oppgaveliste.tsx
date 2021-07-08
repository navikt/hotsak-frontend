//import styled from '@emotion/styled'
import React from 'react'
import styled from 'styled-components/macro'

//import { Oppgave } from 'internal-types';
//import React, { useEffect, useState } from 'react';
//import { useRecoilValue, useRecoilValueLoadable, useResetRecoilState } from 'recoil';
import Panel from 'nav-frontend-paneler'

//import { Behandlingsstatistikk } from './behandlingsstatistikk/Behandlingsstatistikk';
import { OppgaverTable } from '../table/OppgaverTable'

//import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import { Flex, FlexColumn } from '../Flex'
import {
  Tabs,
  /*tabState,*/
  TabType,
} from '../tabs'
//import useSwr from 'swr'
//import {get as httpGet } from '../io/http'
import { Oppgave } from '../types/types.internal'
//import { useLoadingToast } from '../../hooks/useLoadingToast';
//import { useInnloggetSaksbehandler } from '../../state/authentication';
//import { oppgaverState, useRefetchOppgaver } from '../../state/oppgaver';
//import { personState } from '../../state/person';
//import { Scopes, useVarselFilter } from '../../state/varsler';
//import { nullstillAgurkData } from '../../agurkdata';
import { IngenOppgaver } from './IngenOppgaver'
import { useOppgaveliste } from './oppgavelisteHook'


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

const useOppgaverFilteredByTab = () => {
  //const { oid } = useInnloggetSaksbehandler();
  //const aktivTab = useRecoilValue(tabState);
  //const oppgaver = useRecoilValueLoadable<Oppgave[]>(oppgaverState);
  //const [cache, setCache] = useState<Oppgave[]>([]);
  //nullstillAgurkData();
  /*const filtrer = (oppgaver: Oppgave[]): Oppgave[] =>
        aktivTab === TabType.TilGodkjenning
            ? oppgaver.filter((it) => it.tildeling?.saksbehandler?.oid !== oid)
            : aktivTab === TabType.Ventende
            ? oppgaver.filter(({ tildeling }) => tildeling?.saksbehandler?.oid === oid && tildeling?.påVent)
            : oppgaver.filter(({ tildeling }) => tildeling?.saksbehandler?.oid === oid && !tildeling?.påVent);

    useEffect(() => {
        if (oppgaver.state === 'hasValue') {
            setCache(filtrer(oppgaver.contents));
        }
    }, [oppgaver.state]);*/
  /*return {
        state: oppgaver.state,
        contents: oppgaver.state === 'hasValue' ? filtrer(oppgaver.contents) : oppgaver.contents,
        cache: filtrer(cache),
    };*/
}

export const Oppgaveliste = () => {
  const { oppgaver, isError, isLoading } = useOppgaveliste()
  const [aktivTab, setAktivTab]: [TabType, Function] = React.useState(TabType.Ufordelte)
  const byttTab = (nyTab: TabType) => setAktivTab(nyTab)

  if (isError) {
    throw Error('Feil med henting av oppgaver')
  }

  if (isLoading) {
    return <div>Her skal det komme en spinner. Eller kanskje den skal komme i stedet for tabellen?</div>
  }

  //useLoadingToast({ isLoading: oppgaver.state === 'loading', message: 'Henter oppgaver' });

  const hasData = oppgaver.length > 0
  return (
    <Container>
      <FlexColumn>
        <TabContext.Provider value={{ aktivTab, byttTab }}>
          <Tabs />
          <Flex style={{ height: '100%' }}>
            <Content>{hasData ? <OppgaverTable /> : <IngenOppgaver />}</Content>
            {/*<Behandlingsstatistikk />*/}
          </Flex>
        </TabContext.Provider>
      </FlexColumn>
    </Container>
  )
}

export default Oppgaveliste
