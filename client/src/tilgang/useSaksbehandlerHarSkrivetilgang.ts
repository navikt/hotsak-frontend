import { Tilgang, TilgangResultat, TilgangType } from '../types/types.internal'
import { useInnloggetAnsatt } from './useTilgang.ts'
import { AnsattGruppe } from './Ansatt.ts'
import { useMiljø } from '../utils/useMiljø.ts'

export function useSaksbehandlerHarSkrivetilgang(tilganger?: Tilgang): boolean {
  const { erLocal } = useMiljø()
  const { grupper } = useInnloggetAnsatt()

  if (erLocal) {
    const harSkrivetilgang = grupper.includes(AnsattGruppe.HOTSAK_SAKSBEHANDLER)
    return harSkrivetilgang
  } else {
    // TODO: Denne er ikke helt ferdig testet på alle funksjoner i frontend enda, derfor brukes den bare lokalt. På sikt skal det holde med bare denne
    return !!(tilganger?.[TilgangType.KAN_BEHANDLE_SAK] === TilgangResultat.TILLAT)
  }
}
