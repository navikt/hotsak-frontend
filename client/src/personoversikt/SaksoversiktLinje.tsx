import { Tabs } from '@navikt/ds-react'

import { TabLink } from '../saksbilde/TabLink'
import { spacingVar } from '../felleskomponenter/Avstand'
import { useLocation } from 'react-router'

interface SaksoversiktLinjeProps {
  sakerCount: number
  hjelpemidlerCount: number
}

export function SaksoversiktLinje({ sakerCount, hjelpemidlerCount }: SaksoversiktLinjeProps) {
  const location = useLocation()
  return (
    <Tabs value={location.pathname}>
      <Tabs.List style={{ padding: `0 ${spacingVar(8)}` }}>
        <TabLink to={`/personoversikt/saker`}>{`Saker (${sakerCount})`}</TabLink>
        <TabLink to={`/personoversikt/hjelpemidler`}>{`Utlånsoversikt (${hjelpemidlerCount})`}</TabLink>
      </Tabs.List>
    </Tabs>
  )
}
