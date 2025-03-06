import { ErrorSummary } from '@navikt/ds-react'
import { useErNotatPilot } from '../../state/authentication'

export function NotatUtkastVarsel() {
  const erNotatPilot = useErNotatPilot()

  if (!erNotatPilot) {
    return null
  }

  return (
    <ErrorSummary size="small" heading="For å gå videre må du rette opp følgende:" headingTag="h3">
      <ErrorSummary.Item>Du har et utkast til journalføringsnotat som må ferdigstilles eller slettes</ErrorSummary.Item>
    </ErrorSummary>
  )
}
