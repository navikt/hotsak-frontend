import { TilgangResultat, TilgangType, Tilgang } from '../types/types.internal'

export function useSaksbehandlerHarSkrivetilgang(tilganger?: Tilgang): boolean {
  // Hardkoder foreløpig til skrivetilgang i dev og prod frem til backend er klar for å vise dette på sak
  if (window.appSettings.MILJO === 'prod-gcp' || window.appSettings.MILJO === 'dev-gcp') {
    return true
  } else {
    return !!(tilganger?.[TilgangType.KAN_BEHANDLE_SAK] === TilgangResultat.TILLAT)
  }
}
