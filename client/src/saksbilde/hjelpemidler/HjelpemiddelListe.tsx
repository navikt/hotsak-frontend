import { Alert, Heading, VStack } from '@navikt/ds-react'

import { Avstand } from '../../felleskomponenter/Avstand'
import { Strek } from '../../felleskomponenter/Strek.tsx'
import { Brødtekst, Etikett } from '../../felleskomponenter/typografi'
import { HjelpemiddelType, Sak } from '../../types/types.internal'
import { Hastesak } from './Hastesak.tsx'
import { Hjelpemiddel } from './Hjelpemiddel'
import { useArtiklerForSak } from './useArtiklerForSak'

interface HjelpemiddelListeProps {
  tittel: string
  forenkletVisning?: boolean
  sak: Sak
}

export function HjelpemiddelListe({ tittel, forenkletVisning = false, sak }: HjelpemiddelListeProps) {
  const { hjelpemidler, hast } = sak
  const { artikler } = useArtiklerForSak(sak.sakId)

  const artiklerSomIkkeFinnesIOebs = artikler.filter((artikkel) => !artikkel.finnesIOebs)

  const hjelpemidlerAlleredeUtlevert = hjelpemidler.filter((hjelpemiddel) => hjelpemiddel.alleredeUtlevert)

  return (
    <>
      <Heading level="1" size="medium" spacing>
        {tittel}
      </Heading>
      {hast && (
        <div>
          <Hastesak hast={hast} />
          <Strek />
        </div>
      )}
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
      {hjelpemidler.map((hjelpemiddel) => (
        <Hjelpemiddel
          key={hjelpemiddel.hmsnr}
          hjelpemiddel={hjelpemiddel}
          forenkletVisning={forenkletVisning}
          sak={sak}
        />
      ))}
      <VStack gap="2">
        <Etikett>Totalt {summerAntall(hjelpemidler.filter((it) => !it.alleredeUtlevert))} stk. inkl. tilbehør</Etikett>
        {hjelpemidlerAlleredeUtlevert.length > 0 && (
          <div>Totalt. {summerAntall(hjelpemidlerAlleredeUtlevert)} stk. allerede utlevert</div>
        )}
      </VStack>
    </>
  )
}

function summerAntall(hjelpemidler: HjelpemiddelType[]) {
  const summarize = (accumulator: number, currentValue: number) => Number(accumulator) + Number(currentValue)
  return hjelpemidler
    .map((hjelpemiddel) => {
      const antallTilbehør = hjelpemiddel.tilbehør.map((tilbehør) => tilbehør.antall).reduce(summarize, 0)
      return Number(hjelpemiddel.antall) + antallTilbehør
    })
    .reduce(summarize, 0)
}
