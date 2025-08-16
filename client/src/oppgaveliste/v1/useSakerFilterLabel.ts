import { useMemo } from 'react'

import { Statuskategori } from '../../oppgave/oppgaveTypes.ts'
import { SakerFilter, SakerFilterLabel } from '../../types/types.internal.ts'

export function useSakerFilterLabel(statuskategori?: Statuskategori) {
  return useMemo(() => {
    if (!statuskategori || statuskategori === Statuskategori.ÅPEN) {
      return SakerFilterLabel
    }
    return new Map([...SakerFilterLabel].filter(([key]) => key !== SakerFilter.UFORDELTE))
  }, [statuskategori])
}
