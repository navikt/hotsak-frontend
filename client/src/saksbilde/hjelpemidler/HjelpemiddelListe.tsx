import { Heading, VStack } from '@navikt/ds-react'
import { Etikett } from '../../felleskomponenter/typografi'
import { HjelpemiddelType, Sak } from '../../types/types.internal'
import { BrukersFunksjon } from './BrukersFunksjon.tsx'
import { Hastesak } from './Hastesak.tsx'
import { Hjelpemiddel } from './Hjelpemiddel'
import { OebsAlert } from './OebsAlert.tsx'
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
  const brukerFunksjon = sak.personinformasjon?.funksjon

  return (
    <>
      {hast && <Hastesak hast={hast} />}
      {brukerFunksjon && <BrukersFunksjon brukerFunksjon={brukerFunksjon} />}

      <Heading level="1" size="medium">
        {tittel}
      </Heading>
      {!forenkletVisning && artiklerSomIkkeFinnesIOebs.length > 0 && (
        <OebsAlert artikler={artiklerSomIkkeFinnesIOebs} />
      )}
      <div style={{ paddingTop: '2rem' }} />
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
