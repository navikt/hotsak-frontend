import { useMemo } from 'react'

import { SakerFilter, SakerFilterLabel } from '../types/types.internal.ts'
import { Statuskategori } from '../oppgave/oppgaveTypes.ts'

export function useSakerFilterLabel(statuskategori?: Statuskategori) {
  return useMemo(() => {
    if (!statuskategori || statuskategori === Statuskategori.ÅPEN) {
      return SakerFilterLabel
    }
    return new Map([...SakerFilterLabel].filter(([key]) => key !== SakerFilter.UFORDELTE))
  }, [statuskategori])
}
