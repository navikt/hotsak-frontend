import { useMemo } from 'react'
import { IBesvarelse } from './Besvarelse'
import { ISpørreundersøkelse, SpørreundersøkelseId, spørreundersøkelser } from './spørreundersøkelser'

export function useSpørreundersøkelse(spørreundersøkelseId: SpørreundersøkelseId): {
  spørreundersøkelse: ISpørreundersøkelse
  defaultValues: IBesvarelse
} {
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
