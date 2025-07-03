import { Box, Heading, VStack } from '@navikt/ds-react'
import { memo, useMemo } from 'react'
import { BehovsmeldingType, Innsenderbehovsmelding } from '../../types/BehovsmeldingTypes.ts'
import { Sak } from '../../types/types.internal.ts'
import { storForbokstavIOrd } from '../../utils/formater.ts'
import { BrukersFunksjon } from './BrukersFunksjon.tsx'
import { Hast } from './Hast.tsx'
import { Hjelpemiddel } from './Hjelpemiddel.tsx'
import { OebsAlert } from './OebsAlert.tsx'
import { Summering } from './Summering.tsx'
import { FrittStåendeTilbehør } from './TilbehørListe.tsx'
import { useArtiklerForSak } from './useArtiklerForSak.ts'
import { useFinnAlternativprodukt } from './useFinnAlternativprodukt.ts'
import { useFinnHjelpemiddel } from './useFinnHjelpemiddel.ts'

interface HjelpemiddelListeProps {
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}

function HjelpemiddelListe({ sak, behovsmelding }: HjelpemiddelListeProps) {
  const { artikler } = useArtiklerForSak(sak.sakId)

  const artiklerSomIkkeFinnesIOebs = artikler.filter((artikkel) => !artikkel.finnesIOebs)
  const { brukersituasjon, levering } = behovsmelding
  const hjelpemidler = behovsmelding.hjelpemidler.hjelpemidler
  const tilbehør = behovsmelding.hjelpemidler.tilbehør

  const alleHmsNr = useMemo(() => {
    return [
      ...hjelpemidler.flatMap((hjelpemiddel) => [
        hjelpemiddel.produkt.hmsArtNr,
        ...hjelpemiddel.tilbehør.map((tilbehør) => tilbehør.hmsArtNr),
      ]),
      ...tilbehør.map((tilbehør) => tilbehør.hmsArtNr),
    ]
  }, [hjelpemidler, tilbehør])

  const alleHjelpemidler = useMemo(() => {
    return hjelpemidler.map((hjelpemiddel) => hjelpemiddel.produkt.hmsArtNr)
  }, [hjelpemidler])

  const finnHjelpemiddelProdukter = useFinnHjelpemiddel(alleHmsNr)
  const {
    alternativeProdukter,
    alleAlternativeProdukter,
    mutate: hentAlternativProdukter,
  } = useFinnAlternativprodukt(alleHjelpemidler)
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
        <OebsAlert hjelpemider={artiklerSomIkkeFinnesIOebs} />
      )}
      {hjelpemidler.map((hjelpemiddel) => (
        <Box key={hjelpemiddel.produkt.hmsArtNr} background="surface-subtle" padding="4">
          <Hjelpemiddel
            hjelpemiddel={hjelpemiddel}
            sak={sak}
            produkter={finnHjelpemiddelProdukter}
            alternativer={alternativeProdukter[hjelpemiddel.produkt.hmsArtNr] || []}
            alleAlternativer={alleAlternativeProdukter[hjelpemiddel.produkt.hmsArtNr] || []}
            onMutate={hentAlternativProdukter}
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

export default memo(HjelpemiddelListe)
