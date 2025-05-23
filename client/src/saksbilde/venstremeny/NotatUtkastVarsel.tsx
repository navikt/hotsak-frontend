import { ErrorSummary } from '@navikt/ds-react'

import { createSearchParams, useNavigate } from 'react-router-dom'
import { HøyrekolonneTabs } from '../../types/types.internal'

export function NotatUtkastVarsel() {
  const navigate = useNavigate()

  return (
    <ErrorSummary size="small" heading="For å gå videre må du rette opp følgende:" headingTag="h3">
      <ErrorSummary.Item
        onClick={() => {
          const sp = createSearchParams({ valgttab: HøyrekolonneTabs.NOTATER.toString() })
          navigate({ search: sp.toString() })
        }}
      >
        Du har et utkast til notat som må ferdigstilles eller slettes
      </ErrorSummary.Item>
    </ErrorSummary>
  )
}
