import { Utleveringsmåte } from '../../types/BehovsmeldingTypes'
import { VarselFor } from '../../types/types.internal'
import { useBehovsmelding } from '../useBehovsmelding'
import { useVarsler } from './useVarsler'

export function useVarselsregler() {
  const { behovsmelding } = useBehovsmelding()
  const { varsler } = useVarsler()

  const harVarsler = varsler && varsler.length > 0

  return {
    harVarsler,
    harLeveringsVarsel(): boolean {
      return !!(
        behovsmelding?.levering.utleveringsmåte === Utleveringsmåte.ANNEN_BRUKSADRESSE &&
        varsler.find((varsel) => varsel?.varslerFor.includes(VarselFor.ANNEN_ADRESSE))
      )
    },
    harBeskjedTilKommuneVarsel(): boolean {
      return !!behovsmelding?.levering.utleveringMerknad
    },
    harTilbakeleveringsVarsel(): boolean {
      return !!varsler.find((varsel) => varsel?.varslerFor?.includes(VarselFor.TILBAKELEVERING))
    },
    harAlleredeLevertVarsel(): boolean {
      return !!varsler.find((varsel) => varsel?.varslerFor?.includes(VarselFor.ALLEREDE_UTLEVERT))
    },
  }
}
