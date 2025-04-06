import { ErrorSummary } from '@navikt/ds-react'
import { useErNotatPilot } from '../../state/authentication'
import { useNavigate, createSearchParams } from 'react-router-dom'

import { HøyrekolonneTabs } from '../../types/types.internal'

export function NotatUtkastVarsel() {
  const erNotatPilot = useErNotatPilot()
  const navigate = useNavigate()

  if (!erNotatPilot) {
    return null
  }

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
