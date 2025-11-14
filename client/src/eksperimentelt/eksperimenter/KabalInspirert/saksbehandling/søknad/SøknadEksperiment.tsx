import { Box, Label, VStack } from '@navikt/ds-react'
import { memo, useMemo } from 'react'
import {
  ingenAlternativeProdukterForHmsArtNr,
  useAlternativeProdukter,
  useProduktLagerInfo,
} from '../../../../../saksbilde/hjelpemidler/useAlternativeProdukter'
import { useHjelpemiddelprodukter } from '../../../../../saksbilde/hjelpemidler/useHjelpemiddelprodukter'
import { BehovsmeldingType, Innsenderbehovsmelding } from '../../../../../types/BehovsmeldingTypes'
import { Sak } from '../../../../../types/types.internal'
import { BrukersFunksjonEksperiment } from './BrukersFunksjonEksperiment'
import { HjelpemiddelEksperiment } from './HjelpemiddelEksperiment'
import { SummertFrittståendTilbehørEksperiment, SummertHjelpemidlerEksperiment } from './SummeringEksperiment'
import { FrittStåendeTilbehørEksperiment } from './TilbehørListeEksperiment'
import { HastEksperiment } from './HastEksperiment'
import { OebsAlert } from '../../../../../saksbilde/hjelpemidler/OebsAlert'
import { useArtiklerForSak } from '../../../../../saksbilde/hjelpemidler/useArtiklerForSak'

interface SøknadEksperimentProps {
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}

function SøknadEksperiment({ sak, behovsmelding }: SøknadEksperimentProps) {
  const { brukersituasjon } = behovsmelding
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

  const { data: hjelpemiddelprodukter } = useHjelpemiddelprodukter(alleHmsNr)
  const { alternativeProdukterByHmsArtNr, harOppdatertLagerstatus } = useAlternativeProdukter(alleHjelpemidler)
  const { produkter: lagerinfoForProdukter } = useProduktLagerInfo(alleHmsNr)
  const { artikler } = useArtiklerForSak(sak.sakId)
  const artiklerSomIkkeFinnesIOebs = artikler.filter((artikkel) => !artikkel.finnesIOebs)
  const funksjonsbeskrivelse = brukersituasjon.funksjonsbeskrivelse

  return (
    <VStack gap="space-12">
      {behovsmelding.levering.hast && <HastEksperiment hast={behovsmelding.levering.hast} />}

      {behovsmelding.type === BehovsmeldingType.SØKNAD && artiklerSomIkkeFinnesIOebs.length > 0 && (
        <OebsAlert hjelpemidler={artiklerSomIkkeFinnesIOebs} />
      )}

      {hjelpemidler.length > 0 && (
        <VStack paddingBlock="space-20 0">
          <Label size="small" as="h2" textColor="subtle" spacing={false}>
            HJELPEMIDLER
          </Label>
          <SummertHjelpemidlerEksperiment hjelpemidler={hjelpemidler} />
        </VStack>
      )}

      {hjelpemidler.map((hjelpemiddel) => (
        <Box.New
          key={hjelpemiddel.produkt.hmsArtNr}
          paddingInline="space-12"
          background="neutral-softA"
          borderColor="neutral-subtle"
          borderWidth="1"
          borderRadius="large"
        >
          <HjelpemiddelEksperiment
            sak={sak}
            hjelpemiddel={hjelpemiddel}
            produkter={hjelpemiddelprodukter}
            minmaxStyrt={
              lagerinfoForProdukter[hjelpemiddel.produkt.hmsArtNr]?.wareHouseStock?.some((l) => l?.minmax === true) ||
              false
            }
            alternativeProdukter={
              alternativeProdukterByHmsArtNr[hjelpemiddel.produkt.hmsArtNr] ?? ingenAlternativeProdukterForHmsArtNr
            }
            harOppdatertLagerstatus={harOppdatertLagerstatus}
          />
        </Box.New>
      ))}
      {tilbehør && tilbehør.length > 0 && (
        <>
          <VStack paddingBlock="space-20 0">
            <Label size="small" as="h2" textColor="subtle" spacing={false}>
              TILBEHØR
            </Label>
            <SummertFrittståendTilbehørEksperiment tilbehør={tilbehør} />
          </VStack>
          <FrittStåendeTilbehørEksperiment tilbehør={tilbehør} produkter={hjelpemiddelprodukter} />
        </>
      )}
      {funksjonsbeskrivelse && <BrukersFunksjonEksperiment funksjonsbeskrivelse={funksjonsbeskrivelse} />}
    </VStack>
  )
}

export default memo(SøknadEksperiment)
