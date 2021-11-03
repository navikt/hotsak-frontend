import styled from 'styled-components/macro'
import { capitalize } from '../../utils/stringFormating'
import { RullestolIkon } from '../../felleskomponenter/ikoner/RullestolIkon'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { HjelpemiddelType, Personinfo } from '../../types/types.internal'
import { Heading } from '@navikt/ds-react'
import { Hjelpemiddel } from './Hjelpemiddel'
import { Rad } from '../../felleskomponenter/Flex'

const TittelIkon = styled(RullestolIkon)`
  padding-right: 0.5rem;
`
const Container = styled.div`
  padding-top: 1rem;
`

interface HjelpemiddelListeProps {
  hjelpemidler: HjelpemiddelType[]
  personinformasjon: Personinfo
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

export const HjelpemiddelListe: React.FC<HjelpemiddelListeProps> = ({ hjelpemidler, personinformasjon }) => {
  return (
    <>
      <Heading level="1" size="medium" spacing={false}>
        <TittelIkon width={26} height={26} />
        Hjelpemidler
      </Heading>
      <Tekst>{capitalize(personinformasjon.funksjonsnedsettelse.join(', '))}</Tekst>
      <Container>
        {hjelpemidler.map((hjelpemiddel) => {
          return (
            <Hjelpemiddel key={hjelpemiddel.hmsnr} hjelpemiddel={hjelpemiddel} personinformasjon={personinformasjon} />
          )
        })}
        <Rad>
          <Etikett>
            Totalt {summerAntall(hjelpemidler.filter((it) => !it.utlevertFraHjelpemiddelsentralen))} stk. inkl. tilbehør
          </Etikett>
        </Rad>
        {hjelpemidler.filter((hjelpemiddel) => hjelpemiddel.utlevertFraHjelpemiddelsentralen).length > 0 && (
          <Rad>
            Totalt. {summerAntall(hjelpemidler.filter((it) => it.utlevertFraHjelpemiddelsentralen))} stk. allerede
            utlevert
          </Rad>
        )}
      </Container>
    </>
  )
}
