import { useMemo } from 'react'
import { ISpørreundersøkelse, SpørreundersøkelseId, spørreundersøkelser } from './spørreundersøkelser'
import { IBesvarelse } from './Besvarelse'

export function useSpørreundersøkelse(spørreundersøkelseId: SpørreundersøkelseId) {
  return useMemo(() => {
    const spørreundersøkelse: ISpørreundersøkelse = spørreundersøkelser[spørreundersøkelseId]
    return {
      spørreundersøkelse,
      defaultValues: spørreundersøkelse.spørsmål.reduce<IBesvarelse>((defaultValues) => {
        return defaultValues
      }, {}),
    }
  }, [spørreundersøkelseId])
}
