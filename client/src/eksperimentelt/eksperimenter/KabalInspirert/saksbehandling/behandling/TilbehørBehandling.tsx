import { Box, HStack, VStack } from '@navikt/ds-react'
import { TextContainer } from '../../../../../felleskomponenter/typografi'
import { Produkt } from '../../../../../saksbilde/hjelpemidler/Produkt'
import { Tilbehør as Tilbehørtype } from '../../../../../types/BehovsmeldingTypes'
import { Produkt as Produkttype } from '../../../../../types/types.internal'
import { AntallTag } from '../../felleskomponenter/AntallTag'

export function FrittStåendeTilbehørBehandling({
  tilbehør,
  produkter,
}: {
  tilbehør: Tilbehørtype[]
  produkter: Produkttype[]
}) {
  return (
    <VStack gap="4">
      {tilbehør.map((t, idx) => {
        const produkt = produkter.find((p) => p.hmsnr === t.hmsArtNr)

        return (
          <Box.New key={idx} background="info-moderate" padding="4" borderRadius="large">
            <TilbehørBehandling tilbehør={t} produkt={produkt} frittståendeTilbehør={true} />
          </Box.New>
        )
      })}
    </VStack>
  )
}

export function TilbehørListeBehandling({
  tilbehør,
  produkter,
}: {
  tilbehør: Tilbehørtype[]
  produkter: Produkttype[]
}) {
  return (
    <>
      {tilbehør.map((t, idx) => {
        const produkt = produkter.find((p) => p.hmsnr === t.hmsArtNr)
        return (
          <Box.New key={t.hmsArtNr} background="info-moderate" padding="4" borderRadius="large">
            <TilbehørBehandling key={idx} tilbehør={t} produkt={produkt} />
          </Box.New>
        )
      })}
    </>
  )
}

export function TilbehørBehandling({
  tilbehør,
}: {
  tilbehør: Tilbehørtype
  produkt?: Produkttype
  frittståendeTilbehør?: boolean
}) {
  return (
    <>
      <TextContainer>
        <HStack gap="space-16">
          <Produkt hmsnr={tilbehør.hmsArtNr || '-'} navn={tilbehør.navn || '-'} />
          <AntallTag antall={tilbehør.antall} />
        </HStack>
      </TextContainer>
    </>
  )
}
