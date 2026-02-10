import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { Box, Button, Detail, HStack, Label, VStack } from '@navikt/ds-react'
import { memo, useMemo, useState } from 'react'

import { Hast } from '../../../saksbilde/hjelpemidler/Hast.tsx'
import { OebsAlert } from '../../../saksbilde/hjelpemidler/OebsAlert.tsx'
import {
  ingenAlternativeProdukterForHmsArtNr,
  useAlternativeProdukter,
  useProduktLagerInfo,
} from '../../../saksbilde/hjelpemidler/useAlternativeProdukter.ts'
import { useHjelpemiddelprodukter } from '../../../saksbilde/hjelpemidler/useHjelpemiddelprodukter.ts'
import { BehovsmeldingType, type Innsenderbehovsmelding } from '../../../types/BehovsmeldingTypes.ts'
import { Sak } from '../../../types/types.internal.ts'
import { useArtiklerForSak } from '../../useArtiklerForSak.ts'
import { BrukersFunksjonEksperiment } from './BrukersFunksjonEksperiment.tsx'
import { useSummering } from './summering/useSummering.ts'
import { HjelpemiddelV2 } from './HjelpemiddelV2.tsx'
import { FrittStåendeTilbehørV2 } from './tilbehør/TilbehørlisteV2.tsx'

interface HjelpemidlerProps {
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}

function Hjelpemidler({ sak, behovsmelding }: HjelpemidlerProps) {
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
  const [skjulteHjelpemidler, setSkjulteHjelpemidler] = useState(false)
  const [skjulteTilbehør, setSkjulteTilbehør] = useState(false)
  const { alternativeProdukterByHmsArtNr, harOppdatertLagerstatus } = useAlternativeProdukter(alleHjelpemidler)
  const { produkter: lagerinfoForProdukter } = useProduktLagerInfo(alleHmsNr)
  const { artikler } = useArtiklerForSak(sak.sakId)
  const artiklerSomIkkeFinnesIOebs = artikler.filter((artikkel) => !artikkel.finnesIOebs)
  const funksjonsbeskrivelse = brukersituasjon.funksjonsbeskrivelse
  const {
    antallHjelpemidler,
    antallTilbehørTilknyttetHjelpemidler,
    harTilknyttedeTilbehør,
    antallFrittståendeTilbehør,
  } = useSummering(hjelpemidler, tilbehør)

  return (
    <VStack gap="space-12">
      {behovsmelding.levering.hast && <Hast hast={behovsmelding.levering.hast} />}

      {behovsmelding.type === BehovsmeldingType.SØKNAD && artiklerSomIkkeFinnesIOebs.length > 0 && (
        <OebsAlert hjelpemidler={artiklerSomIkkeFinnesIOebs} />
      )}

      {hjelpemidler.length > 0 && (
        <VStack paddingBlock="space-20 0">
          <HStack align="center">
            <Button
              variant="tertiary"
              size="small"
              icon={skjulteHjelpemidler ? <ChevronUpIcon /> : <ChevronDownIcon />}
              onClick={() => setSkjulteHjelpemidler(!skjulteHjelpemidler)}
            />
            <Label size="small" as="h2" textColor="subtle" spacing={false}>
              HJELPEMIDLER
            </Label>
          </HStack>

          <Detail>{`Totalt ${antallHjelpemidler} stk${harTilknyttedeTilbehør ? ` og ${antallTilbehørTilknyttetHjelpemidler} stk tilbehør` : ''}`}</Detail>
        </VStack>
      )}

      {!skjulteHjelpemidler &&
        hjelpemidler.map((hjelpemiddel) => (
          <Box.New
            key={hjelpemiddel.produkt.hmsArtNr}
            paddingInline="space-12"
            background="neutral-softA"
            borderColor="neutral-subtle"
            borderWidth="1"
            borderRadius="large"
          >
            <HjelpemiddelV2
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
            <HStack align="center">
              <Button
                variant="tertiary"
                size="small"
                icon={skjulteTilbehør ? <ChevronUpIcon /> : <ChevronDownIcon />}
                onClick={() => setSkjulteTilbehør(!skjulteTilbehør)}
              />
              <Label size="small" as="h2" textColor="subtle" spacing={false}>
                TILBEHØR
              </Label>
            </HStack>
            <Detail>{`Totalt ${antallFrittståendeTilbehør} stk`}</Detail>
          </VStack>
          {!skjulteTilbehør && (
            <FrittStåendeTilbehørV2 sakId={sak.sakId} tilbehør={tilbehør} produkter={hjelpemiddelprodukter} />
          )}
        </>
      )}
      {funksjonsbeskrivelse && <BrukersFunksjonEksperiment funksjonsbeskrivelse={funksjonsbeskrivelse} />}
    </VStack>
  )
}

export default memo(Hjelpemidler)
