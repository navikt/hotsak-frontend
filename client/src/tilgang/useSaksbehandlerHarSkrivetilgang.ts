import { useErIOppgavekontekst } from '../oppgave/OppgaveContext.ts'
import { Tilgang, TilgangResultat, TilgangType } from '../types/types.internal.ts'
import { useMiljø } from '../utils/useMiljø.ts'
import { AnsattGruppe } from './Ansatt.ts'
import { useInnloggetAnsatt } from './useTilgang.ts'

export function useSaksbehandlerHarSkrivetilgang(tilganger?: Tilgang): boolean {
  const { erLocal } = useMiljø()
  const { grupper } = useInnloggetAnsatt()
  const erIOppgavekontekst = useErIOppgavekontekst()

  let harSkrivetilgang
  if (erLocal) {
    // TODO: Denne er ikke helt ferdig testet på alle funksjoner i frontend enda, derfor brukes den bare lokalt. På sikt skal det holde med bare denne.
    harSkrivetilgang = tilganger?.[TilgangType.KAN_BEHANDLE_SAK] === TilgangResultat.TILLAT
  } else {
    harSkrivetilgang = grupper.includes(AnsattGruppe.HOTSAK_SAKSBEHANDLER)
  }

  return harSkrivetilgang && erIOppgavekontekst
}
