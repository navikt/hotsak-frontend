import { Box, VStack } from '@navikt/ds-react'
import { Skillelinje } from '../../felleskomponenter/Strek'
import { Etikett } from '../../felleskomponenter/typografi'
import { Hjelpemiddel, Tilbehør } from '../../types/BehovsmeldingTypes'

export function Summering({ hjelpemidler, tilbehør }: { hjelpemidler: Hjelpemiddel[]; tilbehør: Tilbehør[] }) {
  const totaltAntallHjelpemidler = summerAntall(
    hjelpemidler.filter((it) => !it.utlevertinfo.alleredeUtlevertFraHjelpemiddelsentralen)
  )
  const totaltAntallFrittståendeTilbehør = tilbehør.map((it) => it.antall).reduce(summarize, 0)

  const hjelpemidlerAlleredeUtlevert = hjelpemidler.filter(
    (hjelpemiddel) => hjelpemiddel.utlevertinfo.alleredeUtlevertFraHjelpemiddelsentralen
  )

  return (
    <Box>
      <VStack gap="2" padding={'0'}>
        <Skillelinje />
        <Etikett>{`Totalt ${totaltAntallHjelpemidler + totaltAntallFrittståendeTilbehør} stk. inkl. tilbehør`}</Etikett>
        {hjelpemidlerAlleredeUtlevert.length > 0 && (
          <div>Totalt. {summerAntall(hjelpemidlerAlleredeUtlevert)} stk. allerede utlevert</div>
        )}
        <Skillelinje />
      </VStack>
    </Box>
  )
}

const summarize = (accumulator: number, currentValue: number) => Number(accumulator) + Number(currentValue)

function summerAntall(hjelpemidler: Hjelpemiddel[]) {
  return hjelpemidler
    .map((hjelpemiddel) => {
      const antallTilbehør = hjelpemiddel.tilbehør.map((tilbehør) => tilbehør.antall).reduce(summarize, 0)
      return Number(hjelpemiddel.antall) + antallTilbehør
    })
    .reduce(summarize, 0)
}
