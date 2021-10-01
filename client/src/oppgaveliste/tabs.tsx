import { css } from '@emotion/react'
import styled from '@emotion/styled'

//import { atom, useRecoilState, useRecoilValue } from 'recoil';
//import { PopoverOrientering } from 'nav-frontend-popover'
import { Normaltekst } from 'nav-frontend-typografi'

import { Flex } from '../felleskomponenter/Flex'
//import saksbehandler  from  '../saksbehandler/innloggetSaksbehandler'
import { useInnloggetSaksbehandler } from '../state/authentication'
import { OppgaveStatusType } from '../types/types.internal'
import { useTabContext } from './Oppgaveliste'
import { useOppgaveliste } from './oppgavelisteHook'

export enum TabType {
  Alle = 'alle',
  Mine = 'mine',
  Ufordelte = 'ufordelte',
  OverførtGosys = 'overførtGosys',
}

const Tablist = styled.div`
  border-bottom: 1px solid var(--navds-color-border);
  margin: 1rem 1.5rem 0;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
`

const NoWrap = styled.span`
  white-space: nowrap;
  display: flex;
  flex-wrap: nowrap;
`

const Tab = styled.button<{ active: boolean }>`
  position: relative;
  background: none;
  border: none;
  padding: 0 1rem 1rem;
  margin: 0;
  height: max-content;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  color: var(--navds-color-text-primary);
  cursor: pointer;
  outline: none;

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 0;
    left: 0;
    bottom: 0;
    background-color: var(--navds-color-action-default);
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    transition: height 0.1s ease;
  }

  &:hover,
  &:focus {
    color: var(--navds-color-action-default);
  }

  ${({ active }) =>
    active &&
    css`
      &:before {
        height: 4px;
      }
    `}
`

const Antall = styled(Normaltekst)`
  margin-left: 0.25rem;
`

interface TabProps {
  tag: TabType
  label: string
  numberOfTasks: number
}

const OppgaveTab = ({ tag, label, numberOfTasks }: TabProps) => {
  const { aktivTab, byttTab } = useTabContext()
  return (
    <Tab
      data-cy={`tab-${tag}`}
      role="tab"
      aria-selected={aktivTab === tag}
      active={aktivTab === tag}
      onClick={() => byttTab(tag)}
    >
      <Flex alignItems="center">
        {label}
        <Antall>({numberOfTasks})</Antall>
      </Flex>
    </Tab>
  )
}

const AlleSakerTab = () => {
  const antallOppgaver = useOppgaveliste().oppgaver.length
  return <OppgaveTab tag={TabType.Alle} label="Alle saker" numberOfTasks={antallOppgaver} />
}

const MineSakerTab = () => {
  const saksbehandler = useInnloggetSaksbehandler()
  const antallOppgaver = useOppgaveliste().oppgaver.filter(
    (oppgave) => oppgave.saksbehandler?.objectId === saksbehandler.objectId
  )
  return <OppgaveTab tag={TabType.Mine} label="Mine saker" numberOfTasks={antallOppgaver.length} />
}

const UfordelteSakerTab = () => {
  const antallOppgaver = useOppgaveliste().oppgaver.filter(
    (oppgave) => !oppgave.saksbehandler && oppgave.status !== OppgaveStatusType.SENDT_GOSYS
  ).length
  return <OppgaveTab tag={TabType.Ufordelte} label="Ufordelte saker" numberOfTasks={antallOppgaver} />
}

const OverførtTilGosysTab = () => {
  const antallOppgaver = useOppgaveliste().oppgaver.filter(
    (oppgave) => oppgave.status === OppgaveStatusType.SENDT_GOSYS
  ).length
  return <OppgaveTab tag={TabType.OverførtGosys} label="Overført til Gosys" numberOfTasks={antallOppgaver} />
}

export const Tabs = () => (
  <Tablist>
    <NoWrap>
      <UfordelteSakerTab />
      <MineSakerTab />
      <AlleSakerTab />
      <OverførtTilGosysTab />
    </NoWrap>
  </Tablist>
)
