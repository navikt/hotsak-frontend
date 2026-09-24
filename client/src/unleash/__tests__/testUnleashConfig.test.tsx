import '@testing-library/jest-dom/vitest'

import { FlagProvider, useFlag } from '@unleash/proxy-client-react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FeatureToggle } from '../FeatureToggle.ts'
import { testUnleashConfig } from '../testUnleashConfig.ts'

function JournalføringPilotIndikator() {
  const erJournalføringPilot = useFlag(FeatureToggle.journalforing)
  return <span>{erJournalføringPilot ? 'på' : 'av'}</span>
}

describe('testUnleashConfig', () => {
  it('leser bootstrap-verdien for journalføringstogglen uten å koble til nettverket', async () => {
    render(
      <FlagProvider config={testUnleashConfig} startClient={false}>
        <JournalføringPilotIndikator />
      </FlagProvider>
    )

    expect(await screen.findByText('på')).toBeInTheDocument()
  })

  it('kan overstyres til av i enkelttester', async () => {
    render(
      <FlagProvider
        config={{
          ...testUnleashConfig,
          bootstrap: [
            {
              name: FeatureToggle.journalforing,
              enabled: false,
              impressionData: false,
              variant: { name: 'disabled', enabled: false },
            },
          ],
        }}
        startClient={false}
      >
        <JournalføringPilotIndikator />
      </FlagProvider>
    )

    expect(await screen.findByText('av')).toBeInTheDocument()
  })
})
