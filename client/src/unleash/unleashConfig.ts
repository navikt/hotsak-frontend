import { type IConfig } from '@unleash/proxy-client-react'

import { mswAktivert } from '../utils/useMiljø.ts'
import { FEATURE_TOGGLE_BOOTSTRAP } from './FeatureToggle.ts'

/**
 * Konfigurasjon for Unleash-klienten (`@unleash/proxy-client-react`).
 *
 * `url` peker på samme origin som resten av applikasjonen. Go-BFF-en
 * autentiserer forespørselen med brukerens innlogging og legger på et
 * server-side Unleash-token før den videresendes til Unleash. `clientKey`
 * er derfor ikke en hemmelighet: BFF-en overstyrer alltid `Authorization`-
 * headeren uansett hva klienten sender.
 *
 * Lokalt er det ingen tilkobling til Unleash (`UNLEASH_ENABLED` er alltid
 * `false` i lokal utvikling), så klienten kobler ikke opp mot nettverket og
 * bruker kun bootstrap-verdiene.
 */
export const unleashEnabled = window.appSettings.UNLEASH_ENABLED === true

/**
 * Om Unleash Developer Toolbar skal lastes. Toolbaren lar utviklere overstyre
 * flaggverdier lokalt i nettleseren, og skal derfor aldri lastes i miljø med
 * ekte brukere. `mswAktivert` er `true` i nøyaktig de to miljøene der det ikke
 * finnes ekte brukerdata (lokal utvikling og labs), og `false` i development
 * og production, som er riktig avgrensning for toolbaren.
 */
export const unleashToolbarAktivert = mswAktivert

export const unleashConfig: IConfig = {
  url: `${window.location.origin}/api/unleash`,
  clientKey: 'irrelevant-erstattes-av-bff',
  appName: 'hotsak-frontend',
  refreshInterval: 60,
  disableRefresh: !unleashEnabled,
  disableMetrics: !unleashEnabled,
  bootstrap: Object.entries(FEATURE_TOGGLE_BOOTSTRAP).map(([name, enabled]) => ({
    name,
    enabled,
    variant: { name: 'disabled', enabled: false },
    impressionData: false,
  })),
  bootstrapOverride: true,
}
