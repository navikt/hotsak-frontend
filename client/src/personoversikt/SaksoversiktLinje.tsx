import { Tabs } from '@navikt/ds-react'

import { useLocation } from 'react-router'
import { Eksperiment } from '../felleskomponenter/Eksperiment.tsx'
import { TabLink } from '../saksbilde/TabLink'

interface SaksoversiktLinjeProps {
  sakerCount: number
  hjelpemidlerCount: number
}

export function SaksoversiktLinje({ sakerCount, hjelpemidlerCount }: SaksoversiktLinjeProps) {
  const location = useLocation()
  return (
    <Tabs value={location.pathname}>
      <Tabs.List style={{ padding: `0 var(--ax-space-16)` }}>
        <Eksperiment>
          <TabLink to={`/personoversikt/oppgaver`}>{`Oppgaver`}</TabLink>
        </Eksperiment>
        <TabLink to={`/personoversikt/saker`}>{`Saker (${sakerCount})`}</TabLink>
        <Eksperiment>
          <TabLink to={`/personoversikt/dokumenter`}>{`Dokumenter`}</TabLink>
        </Eksperiment>
        <TabLink to={`/personoversikt/hjelpemidler`}>{`Utlånsoversikt (${hjelpemidlerCount})`}</TabLink>
      </Tabs.List>
    </Tabs>
  )
}
