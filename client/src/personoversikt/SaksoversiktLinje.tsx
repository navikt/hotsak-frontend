import { Tabs } from '@navikt/ds-react'

import { TabLink } from '../saksbilde/TabLink'
import { spacingVar } from '../felleskomponenter/Avstand'

interface SaksoversiktLinjeProps {
  sakerCount: number
  hjelpemidlerCount: number
}

export function SaksoversiktLinje({ sakerCount, hjelpemidlerCount }: SaksoversiktLinjeProps) {
  return (
    <Tabs>
      <Tabs.List style={{ padding: `0 ${spacingVar(8)}` }}>
        <TabLink to={`/personoversikt/saker`} title={`Saker (${sakerCount})`}>
          {`Saker (${sakerCount})`}
        </TabLink>
        <TabLink to={`/personoversikt/hjelpemidler`} title={`Utlånsoversikt (${hjelpemidlerCount})`}>
          {`Utlånsoversikt (${hjelpemidlerCount})`}
        </TabLink>
      </Tabs.List>
    </Tabs>
  )
}
