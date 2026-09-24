import { type IConfig } from '@unleash/proxy-client-react'

import { FeatureToggle } from './FeatureToggle.ts'

/**
 * Unleash-konfigurasjon for tester. Kobler aldri til nettverket
 * (`disableRefresh`/`disableMetrics`), og bootstrap-verdiene brukes uendret
 * (`bootstrapOverride: true`). Bruk sammen med `startClient={false}` på
 * `FlagProvider` slik at klienten aldri prøver å polle Unleash i tester, i tråd
 * med Unleash sin egen anbefaling for enhetstesting:
 * https://docs.getunleash.io/sdks/react-native#unit-testing
 *
 * `JournalforingJournalpostkort` er satt til aktivert, siden det er det ene
 * flagget i bruk. Overstyr bootstrap-verdien i enkelttester ved behov.
 */
export const testUnleashConfig: IConfig = {
  url: 'http://localhost/api/unleash',
  clientKey: 'test',
  appName: 'hotsak-frontend-test',
  disableRefresh: true,
  disableMetrics: true,
  bootstrapOverride: true,
  bootstrap: [
    {
      name: FeatureToggle.journalforing,
      enabled: true,
      variant: { name: 'disabled', enabled: false },
      impressionData: false,
    },
  ],
}
