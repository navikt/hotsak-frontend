import { Detail } from '@navikt/ds-react'
import { Hjelpemiddel, Tilbehør } from '../../../../../types/BehovsmeldingTypes'

export function SummertHjelpemidlerEksperiment({ hjelpemidler }: { hjelpemidler: Hjelpemiddel[] }) {
  const totaltAntallHjelpemidler = summerAntallHjelpemidler(hjelpemidler)

  const totaltAntallTilbehørTilknyttetHjelpemidler = summerAntallTilbehør(hjelpemidler)

  return (
    <Detail>{`Totalt ${totaltAntallHjelpemidler} stk ${totaltAntallTilbehørTilknyttetHjelpemidler > 0 ? `, og ${totaltAntallTilbehørTilknyttetHjelpemidler} stk tilbehør` : ''}`}</Detail>
  )
}

function summerAntallTilbehør(hjelpemidler: Hjelpemiddel[]) {
  return hjelpemidler
    .map((hjelpemiddel) => {
      return hjelpemiddel.tilbehør.map((tilbehør) => tilbehør.antall).reduce(summarize, 0)
    })
    .reduce(summarize, 0)
}

function summerAntallHjelpemidler(hjelpemidler: Hjelpemiddel[]) {
  return hjelpemidler
    .map((hjelpemiddel) => {
      return Number(hjelpemiddel.antall)
    })
    .reduce(summarize, 0)
}

export function SummertFrittståendTilbehørEksperiment({ tilbehør }: { tilbehør: Tilbehør[] }) {
  const totaltAntallFrittståendeTilbehør = tilbehør.map((it) => it.antall).reduce(summarize, 0)

  return <Detail>{`Totalt ${totaltAntallFrittståendeTilbehør} stk`}</Detail>
}

const summarize = (accumulator: number, currentValue: number) => Number(accumulator) + Number(currentValue)
