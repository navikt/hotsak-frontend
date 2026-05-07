import { Tabs } from '@navikt/ds-react'

import { useLocation } from 'react-router'
import { Eksperiment } from '../felleskomponenter/Eksperiment.tsx'
import { TabLink } from '../saksbilde/TabLink'
import classes from './PersonoversiktTabs.module.css'

export interface PersonoversiktTabsProps {
  sakerCount: number
  hjelpemidlerCount: number
}

export function PersonoversiktTabs({ sakerCount, hjelpemidlerCount }: PersonoversiktTabsProps) {
  const location = useLocation()
  return (
    <Tabs value={location.pathname}>
      <Tabs.List className={classes.tabsList}>
        <TabLink to="/personoversikt/saker">{`Saker (${sakerCount})`}</TabLink>
        <Eksperiment>
          <TabLink to="/personoversikt/oppgaver">Oppgaver</TabLink>
          <TabLink to="/personoversikt/dokumenter">Dokumenter</TabLink>
        </Eksperiment>
        <TabLink to="/personoversikt/hjelpemidler">{`Utlånsoversikt (${hjelpemidlerCount})`}</TabLink>
      </Tabs.List>
    </Tabs>
  )
}
