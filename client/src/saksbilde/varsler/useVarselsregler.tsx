import { Leveringsmåte as LeveringsmåteType, VarselFor } from '../../types/types.internal'
import { useSak } from '../useSak'
import { useVarsler } from './useVarsler'

export function useVarselsregler() {
  const { data: sak } = useSak()?.sak ?? { data: undefined }
  const { varsler } = useVarsler()

  const harVarsler = varsler && varsler.length > 0

  return {
    harVarsler,
    harLeveringsVarsel(): boolean {
      return !!(
        sak?.levering.leveringsmåte === LeveringsmåteType.ANNEN_ADRESSE &&
        varsler.find((varsel) => varsel?.varslerFor.includes(VarselFor.ANNEN_ADRESSE))
      )
    },
    harBeskjedTilKommuneVarsel(): boolean {
      return !!(
        sak?.levering.merknad && varsler.find((varsel) => varsel?.varslerFor.includes(VarselFor.BESKJED_TIL_KOMMUNE))
      )
    },
    harTilbakeleveringsVarsel(): boolean {
      return !!varsler.find((varsel) => varsel?.varslerFor?.includes(VarselFor.TILBAKELEVERING))
    },
  }
}
