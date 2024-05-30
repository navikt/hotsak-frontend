import styled from 'styled-components'

import { Alert, Heading } from '@navikt/ds-react'

import { Avstand } from '../../felleskomponenter/Avstand'
import { Rad } from '../../felleskomponenter/Flex'
import { Brødtekst, Etikett } from '../../felleskomponenter/typografi'
import { HjelpemiddelType, Sak } from '../../types/types.internal'
import { Hjelpemiddel } from './Hjelpemiddel'
import { useArtiklerForSak } from './useArtiklerForSak'
import { Hastesak } from './Hastesak.tsx'
import { Strek } from '../../felleskomponenter/Strek.tsx'

const Container = styled.div`
  padding-top: 1rem;
`

interface HjelpemiddelListeProps {
  tittel: string
  forenkletVisning?: boolean
  sak: Sak
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

export function HjelpemiddelListe({ tittel, forenkletVisning = false, sak }: HjelpemiddelListeProps) {
  const { hjelpemidler, hast } = sak
  const { artikler } = useArtiklerForSak(sak.sakId)

  const artiklerSomIkkeFinnesIOebs = artikler.filter((artikkel) => !artikkel.finnesIOebs)

  return (
    <>
      <Heading level="1" size="medium" spacing={false}>
        {tittel}
      </Heading>
      <Container>
        {hast && (
          <Avstand paddingBottom={6}>
            <Hastesak hast={hast} />
            <Strek />
          </Avstand>
        )}
        <Avstand paddingBottom={6}>
          {!forenkletVisning && artiklerSomIkkeFinnesIOebs.length > 0 && (
            <Alert variant="warning" size="small" fullWidth>
              <>
                <Brødtekst>
                  {`${artiklerSomIkkeFinnesIOebs.length > 1 ? 'Artiklene' : 'Artikkelen'} under finnes ikke i OEBS og blir derfor ikke 
            automatisk overført til SF:`}
                </Brødtekst>
                <Avstand paddingTop={1} />
                <ul>
                  {artiklerSomIkkeFinnesIOebs.map((artikkel) => {
                    return <li key={artikkel.hmsnr}>{`${artikkel.hmsnr}: ${artikkel.navn}`}</li>
                  })}
                </ul>
              </>
            </Alert>
          )}
        </Avstand>
        {hjelpemidler.map((hjelpemiddel) => {
          return (
            <Hjelpemiddel
              key={hjelpemiddel.hmsnr}
              hjelpemiddel={hjelpemiddel}
              forenkletVisning={forenkletVisning}
              sak={sak}
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
