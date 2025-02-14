import { Box, Heading, VStack } from '@navikt/ds-react'
import { BehovsmeldingType, Innsenderbehovsmelding } from '../../types/BehovsmeldingTypes.ts'
import { Sak } from '../../types/types.internal.ts'
import { storForbokstavIOrd } from '../../utils/formater.ts'
import { BrukersFunksjon } from '../hjelpemidler/BrukersFunksjon.tsx'
import { OebsAlert } from '../hjelpemidler/OebsAlert.tsx'
import { useArtiklerForSak } from '../hjelpemidler/useArtiklerForSak.ts'
import { useFinnHjelpemiddel } from '../hjelpemidler/useFinnHjelpemiddel.ts'
import { Hast } from './Hast.tsx'
import { Hjelpemiddel } from './Hjelpemiddel.tsx'
import { Summering } from './Summering.tsx'
import { FrittStåendeTilbehør } from './TilbehørListe.tsx'

interface HjelpemiddelListeProps {
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}

export function HjelpemiddelListeNyLayout({ sak, behovsmelding }: HjelpemiddelListeProps) {
  const { artikler } = useArtiklerForSak(sak.sakId)

  const artiklerSomIkkeFinnesIOebs = artikler.filter((artikkel) => !artikkel.finnesIOebs)
  const { brukersituasjon, levering } = behovsmelding
  const hjelpemidler = behovsmelding.hjelpemidler.hjelpemidler
  const tilbehør = behovsmelding.hjelpemidler.tilbehør

  const alleHmsNr = [
    ...hjelpemidler.flatMap((hjelpemiddel) => [
      hjelpemiddel.produkt.hmsArtNr,
      ...hjelpemiddel.tilbehør.map((tilbehør) => tilbehør.hmsArtNr),
    ]),
    ...tilbehør.map((tilbehør) => tilbehør.hmsArtNr),
  ]

  const finnHjelpemiddelProdukter = useFinnHjelpemiddel(alleHmsNr)

  const funksjonsbeskrivelse = brukersituasjon.funksjonsbeskrivelse

  return (
    <VStack gap="4">
      <Heading level="1" size="small" visuallyHidden={true}>
        {storForbokstavIOrd(sak.sakstype)}
      </Heading>
      {levering.hast && <Hast hast={levering.hast} />}

      {hjelpemidler.length > 0 && (
        <Heading level="2" size="medium">
          Hjelpemidler
        </Heading>
      )}
      {behovsmelding.type === BehovsmeldingType.SØKNAD && artiklerSomIkkeFinnesIOebs.length > 0 && (
        <OebsAlert artikler={artiklerSomIkkeFinnesIOebs} />
      )}
      {hjelpemidler.map((hjelpemiddel) => (
        <Box background="surface-subtle" padding="4">
          <Hjelpemiddel
            key={hjelpemiddel.produkt.hmsArtNr}
            hjelpemiddel={hjelpemiddel}
            sak={sak}
            produkter={finnHjelpemiddelProdukter}
          />
        </Box>
      ))}
      {tilbehør && tilbehør.length > 0 && (
        <>
          <Heading level="2" size="small">
            Tilbehør
          </Heading>
          <FrittStåendeTilbehør tilbehør={tilbehør} produkter={finnHjelpemiddelProdukter} />
        </>
      )}
      <Summering hjelpemidler={hjelpemidler} tilbehør={tilbehør} />

      {funksjonsbeskrivelse && <BrukersFunksjon funksjonsbeskrivelse={funksjonsbeskrivelse} />}
    </VStack>
  )
}
