import { Box, Heading, VStack } from '@navikt/ds-react'
import { memo, useMemo } from 'react'
import { Strek } from '../../../../../felleskomponenter/Strek'
import { BrukersFunksjon } from '../../../../../saksbilde/hjelpemidler/BrukersFunksjon'
import { OebsAlert } from '../../../../../saksbilde/hjelpemidler/OebsAlert'
import { Summering } from '../../../../../saksbilde/hjelpemidler/Summering'
import {
  ingenAlternativeProdukterForHmsArtNr,
  useAlternativeProdukter,
  useProduktLagerInfo,
} from '../../../../../saksbilde/hjelpemidler/useAlternativeProdukter'
import { useArtiklerForSak } from '../../../../../saksbilde/hjelpemidler/useArtiklerForSak'
import { useHjelpemiddelprodukter } from '../../../../../saksbilde/hjelpemidler/useHjelpemiddelprodukter'
import { GreitÅViteCard } from '../../../../../saksbilde/venstremeny/GreitÅViteCard'
import { BehovsmeldingType, Innsenderbehovsmelding } from '../../../../../types/BehovsmeldingTypes'
import { Sak } from '../../../../../types/types.internal'
import { HjelpemiddelEksperiment } from './HjelpemiddelEksperiment'
import { FrittStåendeTilbehørEksperiment } from './TilbehørListeEksperiment'

interface SøknadEksperimentProps {
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}

function SøknadEksperiment({ sak, behovsmelding }: SøknadEksperimentProps) {
  const { artikler } = useArtiklerForSak(sak.sakId)

  const artiklerSomIkkeFinnesIOebs = artikler.filter((artikkel) => !artikkel.finnesIOebs)
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
  const funksjonsbeskrivelse = brukersituasjon.funksjonsbeskrivelse

  return (
    <VStack gap="4">
      {<GreitÅViteCard greitÅViteFakta={sak.greitÅViteFaktum} />}

      <div>
        <Strek />
      </div>
      {hjelpemidler.length > 0 && (
        <Heading level="2" size="medium">
          Hjelpemidler
        </Heading>
      )}
      {behovsmelding.type === BehovsmeldingType.SØKNAD && artiklerSomIkkeFinnesIOebs.length > 0 && (
        <OebsAlert hjelpemidler={artiklerSomIkkeFinnesIOebs} />
      )}

      {hjelpemidler.map((hjelpemiddel) => (
        <Box.New key={hjelpemiddel.produkt.hmsArtNr} background="neutral-soft" padding="4" borderRadius="large">
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
          <Heading level="2" size="small">
            Tilbehør
          </Heading>
          <FrittStåendeTilbehørEksperiment tilbehør={tilbehør} produkter={hjelpemiddelprodukter} />
        </>
      )}
      <Summering hjelpemidler={hjelpemidler} tilbehør={tilbehør} />

      {funksjonsbeskrivelse && <BrukersFunksjon funksjonsbeskrivelse={funksjonsbeskrivelse} />}
    </VStack>
  )
}

export default memo(SøknadEksperiment)
