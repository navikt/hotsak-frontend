import styled from 'styled-components/macro'

import { Flex } from '../felleskomponenter/Flex'
import { useTabContext } from './Oppgaveliste'

export enum TabType {
  Alle = 'alle',
  Mine = 'mine',
  Ufordelte = 'ufordelte',
  Ferdigstilte = 'ferdigstilte',
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
    `
      &:before {
        height: 4px;
      }
    `}
`

interface TabProps {
  tag: TabType
  label: string
}

const OppgaveTab = ({ tag, label }: TabProps) => {
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
      </Flex>
    </Tab>
  )
}


const AlleSakerTab = () => {
  return <OppgaveTab tag={TabType.Alle} label="Alle saker"  />
}

const MineSakerTab = () => {
  return <OppgaveTab tag={TabType.Mine} label="Mine saker"  />
}

const FerdigstilteSakerTab = () => {
    return <OppgaveTab tag={TabType.Ferdigstilte} label="Ferdigstilte saker" />
}

const UfordelteSakerTab = () => {
  return <OppgaveTab tag={TabType.Ufordelte} label="Ufordelte saker"  />
}

const OverførtTilGosysTab = () => {
  return (
    <OppgaveTab
      tag={TabType.OverførtGosys}
      label="Overført til Gosys"
    />
  )
}

export const Tabs = () => {
  
  return (
    <Tablist>
      <NoWrap>
        <UfordelteSakerTab  />
        <MineSakerTab />
        <FerdigstilteSakerTab />
        <AlleSakerTab  />
        <OverførtTilGosysTab  />
      </NoWrap>
    </Tablist>
  )
}
