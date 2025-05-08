import { Tilgang, TilgangResultat, TilgangType } from '../types/types.internal'
import { useInnloggetAnsatt } from './useTilgang.ts'
import { AnsattGruppe } from './Ansatt.ts'

export function useSaksbehandlerHarSkrivetilgang(tilganger?: Tilgang): boolean {
  const { grupper } = useInnloggetAnsatt()

  // Hardkoder foreløpig til skrivetilgang i dev og prod frem til backend er klar for å vise dette på sak
  if (window.appSettings.MILJO === 'prod-gcp') {
    return true
  }
  if (window.appSettings.MILJO === 'dev-gcp') {
    // Kun midlertidig logikk for å teste om resten av logikken rundt lesemodus fungerer frem til ny policy løsning er på plass i backend
    const harSkrivetilgang = grupper.includes(AnsattGruppe.HOTSAK_SAKSBEHANDLER)
    return harSkrivetilgang
  } else {
    return !!(tilganger?.[TilgangType.KAN_BEHANDLE_SAK] === TilgangResultat.TILLAT)
  }
}
