import { SakerFilter, SakerFilterLabel, Statuskategori } from '../types/types.internal.ts'
import { useMemo } from 'react'

export function useSakerFilterLabel(statuskategori?: Statuskategori) {
  return useMemo(() => {
    if (!statuskategori || statuskategori === Statuskategori.ÅPEN) {
      return SakerFilterLabel
    }
    return new Map([...SakerFilterLabel].filter(([key]) => key !== SakerFilter.UFORDELTE))
  }, [statuskategori])
}
