import { Heading, VStack } from '@navikt/ds-react'
import { Etikett } from '../../felleskomponenter/typografi.tsx'
import { Hjelpemiddel as HjelpemiddelType, Innsenderbehovsmelding } from '../../types/BehovsmeldingTypes.ts'
import { Sak } from '../../types/types.internal.ts'
import { BrukersFunksjon } from '../hjelpemidler/BrukersFunksjon.tsx'
import { Hast } from './Hast.tsx'
import { Hjelpemiddel } from './Hjelpemiddel.tsx'

interface HjelpemiddelListeProps {
  //forenkletVisning?: boolean
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}

export function HjelpemiddelListeNyLayout({
  //forenkletVisning = false,
  sak,
  behovsmelding,
}: HjelpemiddelListeProps) {
  //const { artikler } = useArtiklerForSak(sak.sakId)

  //const artiklerSomIkkeFinnesIOebs = artikler.filter((artikkel) => !artikkel.finnesIOebs)
  const { brukersituasjon, levering } = behovsmelding
  const hjelpemidler = behovsmelding.hjelpemidler.hjelpemidler

  const hjelpemidlerAlleredeUtlevert = hjelpemidler.filter(
    (hjelpemiddel) => hjelpemiddel.utlevertinfo.alleredeUtlevertFraHjelpemiddelsentralen
  )
  const funksjonsbeskrivelse = brukersituasjon.funksjonsbeskrivelse

  return (
    <VStack gap="4">
      {levering.hast && <Hast hast={levering.hast} />}

      <Heading level="1" size="small">
        Hjelpemidler (ny layout)
      </Heading>
      {/*!forenkletVisning && artiklerSomIkkeFinnesIOebs.length > 0 && (
        <OebsAlert artikler={artiklerSomIkkeFinnesIOebs} />}
      )}*/}
      {hjelpemidler.map((hjelpemiddel) => (
        <Hjelpemiddel
          key={hjelpemiddel.produkt.hmsArtNr}
          hjelpemiddel={hjelpemiddel}
          //    forenkletVisning={forenkletVisning}
          sak={sak}
        />
      ))}

      {/* TODO, sjekk logikk for summering. Kan vi bruke tall fra behovsmeldingen i stedet? Hva brukes i PDF? */}
      <VStack gap="2">
        <Etikett>
          Totalt {summerAntall(hjelpemidler.filter((it) => !it.utlevertinfo.alleredeUtlevertFraHjelpemiddelsentralen))}{' '}
          stk. inkl. tilbehør
        </Etikett>
        {hjelpemidlerAlleredeUtlevert.length > 0 && (
          <div>Totalt. {summerAntall(hjelpemidlerAlleredeUtlevert)} stk. allerede utlevert</div>
        )}
      </VStack>

      {funksjonsbeskrivelse && <BrukersFunksjon funksjonsbeskrivelse={funksjonsbeskrivelse} />}
    </VStack>
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
