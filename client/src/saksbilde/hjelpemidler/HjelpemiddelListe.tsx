import { Heading, VStack } from '@navikt/ds-react'
import { Etikett } from '../../felleskomponenter/typografi'
import { Hjelpemiddel as HjelpemiddelType, Innsenderbehovsmelding } from '../../types/BehovsmeldingTypes.ts'
import { Sak } from '../../types/types.internal'
import { BrukersFunksjon } from './BrukersFunksjon.tsx'
import { Hastesak } from './Hastesak.tsx'
import { OebsAlert } from './OebsAlert.tsx'
import { useArtiklerForSak } from './useArtiklerForSak'
import { Hjelpemiddel } from './Hjelpemiddel.tsx'
import { Skillelinje } from '../../felleskomponenter/Strek.tsx'

interface HjelpemiddelListeProps {
  forenkletVisning?: boolean
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}

export function HjelpemiddelListe({ forenkletVisning = false, sak, behovsmelding }: HjelpemiddelListeProps) {
  const { artikler } = useArtiklerForSak(sak.sakId)

  const artiklerSomIkkeFinnesIOebs = artikler.filter((artikkel) => !artikkel.finnesIOebs)
  const { brukersituasjon, levering } = behovsmelding
  const hjelpemidler = behovsmelding.hjelpemidler.hjelpemidler

  const hjelpemidlerAlleredeUtlevert = hjelpemidler.filter(
    (hjelpemiddel) => hjelpemiddel.utlevertinfo.alleredeUtlevertFraHjelpemiddelsentralen
  )
  const funksjonsbeskrivelse = brukersituasjon.funksjonsbeskrivelse

  return (
    <>
      {levering.hast && <Hastesak hast={levering.hast} />}

      <Heading level="1" size="medium">
        Hjelpemidler
      </Heading>
      {!forenkletVisning && artiklerSomIkkeFinnesIOebs.length > 0 && (
        <OebsAlert artikler={artiklerSomIkkeFinnesIOebs} />
      )}
      <div style={{ paddingTop: '2rem' }} />
      {hjelpemidler.map((hjelpemiddel) => (
        <Hjelpemiddel
          key={hjelpemiddel.produkt.hmsArtNr}
          hjelpemiddel={hjelpemiddel}
          forenkletVisning={forenkletVisning}
          sak={sak}
        />
      ))}
      <VStack gap="2">
        <Etikett>
          Totalt {summerAntall(hjelpemidler.filter((it) => !it.utlevertinfo.alleredeUtlevertFraHjelpemiddelsentralen))}{' '}
          stk. inkl. tilbehør
        </Etikett>
        {hjelpemidlerAlleredeUtlevert.length > 0 && (
          <div>Totalt. {summerAntall(hjelpemidlerAlleredeUtlevert)} stk. allerede utlevert</div>
        )}
      </VStack>
      <Skillelinje />
      {funksjonsbeskrivelse && <BrukersFunksjon funksjonsbeskrivelse={funksjonsbeskrivelse} />}
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
