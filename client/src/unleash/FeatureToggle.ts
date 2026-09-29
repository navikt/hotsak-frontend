/**
 * Typed navn på Unleash-flagg brukt i hotsak-frontend. Hold navnene i synk med
 * flaggene som er opprettet i Unleash-instansen til teamdigihot.
 *
 * Bruk sammen med `useFlag`/`useVariant` fra `@unleash/proxy-client-react`
 * i stedet for å skrive flaggnavn som fritekst i komponentene.
 */
export enum FeatureToggle {
  journalforing = 'hotsak-frontend.journalforing',
}

/**
 * Bootstrap-verdi brukt før Unleash-klienten har hentet ekte verdier fra
 * proxyen. Flagget starter av i miljøer med ekte brukere, også hvis Unleash
 * ikke svarer. I lokal utvikling og labs setter unleashConfig.ts flagget på.
 */
export const FEATURE_TOGGLE_BOOTSTRAP: Record<FeatureToggle, boolean> = {
  [FeatureToggle.journalforing]: false,
}
