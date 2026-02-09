import { useMemo } from 'react'
import { Hjelpemiddel, Tilbehør } from '../../../../types/BehovsmeldingTypes'

const summarize = (accumulator: number, currentValue: number) => Number(accumulator) + Number(currentValue)

export function useSummering(hjelpemidler: Hjelpemiddel[], frittstående: Tilbehør[]): Summering {
  const antallHjelpemidler = useMemo(() => {
    return hjelpemidler.map((hjelpemiddel) => Number(hjelpemiddel.antall)).reduce(summarize, 0)
  }, [hjelpemidler])

  const antallTilbehørTilknyttetHjelpemidler = useMemo(() => {
    return hjelpemidler
      .map((hjelpemiddel) => {
        return hjelpemiddel.tilbehør.map((tilbehør) => tilbehør.antall).reduce(summarize, 0)
      })
      .reduce(summarize, 0)
  }, [hjelpemidler])

  const antallFrittståendeTilbehør = useMemo(() => {
    return frittstående.map((it) => it.antall).reduce(summarize, 0)
  }, [frittstående])

  return {
    antallHjelpemidler,
    antallTilbehørTilknyttetHjelpemidler,
    harTilknyttedeTilbehør: antallTilbehørTilknyttetHjelpemidler > 0,
    antallFrittståendeTilbehør,
    totaltAntall: antallHjelpemidler + antallTilbehørTilknyttetHjelpemidler + antallFrittståendeTilbehør,
  }
}

export interface Summering {
  antallHjelpemidler: number
  antallTilbehørTilknyttetHjelpemidler: number
  harTilknyttedeTilbehør: boolean
  antallFrittståendeTilbehør: number
  totaltAntall: number
}
