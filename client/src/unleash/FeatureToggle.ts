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
 * proxyen, og som fallback i miljø uten Unleash-tilkobling (lokal utvikling).
 * Skal ikke vise nye funksjoner i produksjon ved oppstartsfeil, så flagget
 * starter av inntil Unleash har evaluert konteksten.
 */
export const FEATURE_TOGGLE_BOOTSTRAP: Record<FeatureToggle, boolean> = {
  [FeatureToggle.journalforing]: false,
}
