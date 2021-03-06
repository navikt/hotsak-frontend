import styled from 'styled-components'

import { Heading } from '@navikt/ds-react'

import { Rad } from '../../felleskomponenter/Flex'
import { Etikett } from '../../felleskomponenter/typografi'
import { HjelpemiddelType, Personinfo } from '../../types/types.internal'
import { Hjelpemiddel } from './Hjelpemiddel'

const Container = styled.div`
  padding-top: 1rem;
`

interface HjelpemiddelListeProps {
  hjelpemidler: HjelpemiddelType[]
  personinformasjon: Personinfo
  tittel: string
  forenkletVisning?: boolean
}

const summerAntall = (hjelpemidler: HjelpemiddelType[]) => {
  const summarize = (accumulator: number, currentValue: number) => Number(accumulator) + Number(currentValue)

  return hjelpemidler
    .map((hjelpemiddel) => {
      const antallTilbehør = hjelpemiddel.tilbehør.map((tilbehør) => tilbehør.antall).reduce(summarize, 0)
      return Number(hjelpemiddel.antall) + antallTilbehør
    })
    .reduce(summarize, 0)
}

export const HjelpemiddelListe: React.FC<HjelpemiddelListeProps> = ({
  tittel,
  hjelpemidler,
  personinformasjon,
  forenkletVisning = false,
}) => {
  return (
    <>
      <Heading level="1" size="medium" spacing={false}>
        {tittel}
      </Heading>
      <Container>
        {hjelpemidler.map((hjelpemiddel) => {
          return (
            <Hjelpemiddel
              key={hjelpemiddel.hmsnr}
              hjelpemiddel={hjelpemiddel}
              personinformasjon={personinformasjon}
              forenkletVisning={forenkletVisning}
            />
          )
        })}
        <Rad>
          <Etikett>
            Totalt {summerAntall(hjelpemidler.filter((it) => !it.alleredeUtlevert))} stk. inkl. tilbehør
          </Etikett>
        </Rad>
        {hjelpemidler.filter((hjelpemiddel) => hjelpemiddel.alleredeUtlevert).length > 0 && (
          <Rad>Totalt. {summerAntall(hjelpemidler.filter((it) => it.alleredeUtlevert))} stk. allerede utlevert</Rad>
        )}
      </Container>
    </>
  )
}
