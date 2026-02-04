import { PencilIcon } from '@navikt/aksel-icons'
import { Box, Button, HStack, VStack } from '@navikt/ds-react'
import { BrytbarBrødtekst, Brødtekst, Etikett, TextContainer } from '../../../../../felleskomponenter/typografi'
import { Opplysninger } from '../../../../../saksbilde/hjelpemidler/Opplysninger'
import { Varsler } from '../../../../../saksbilde/hjelpemidler/Varsel'
import { useSaksregler } from '../../../../../saksregler/useSaksregler'
import { Tilbehør as Tilbehørtype } from '../../../../../types/BehovsmeldingTypes'
import { Produkt as Produkttype } from '../../../../../types/types.internal'
import { AntallTag } from '../../../../../sak/v2/AntallTag'
import { ProduktEksperiment } from './ProduktEksperiment'

export function FrittStåendeTilbehørEksperiment({
  tilbehør,
  produkter,
}: {
  tilbehør: Tilbehørtype[]
  produkter: Produkttype[]
}) {
  const { kanEndreHmsnr } = useSaksregler()
  return (
    <VStack gap="4">
      {tilbehør.map((t, idx) => {
        const produkt = produkter.find((p) => p.hmsArtNr === t.hmsArtNr)

        return (
          <Box.New
            key={idx}
            borderRadius="large"
            padding="4"
            background="neutral-softA"
            borderColor="neutral-subtle"
            borderWidth="1"
          >
            <Tilbehør tilbehør={t} produkt={produkt} frittståendeTilbehør={true} kanEndreHmsnr={kanEndreHmsnr} />
          </Box.New>
        )
      })}
    </VStack>
  )
}

export function TilbehørListeEksperiment({
  tilbehør,
  produkter,
}: {
  tilbehør: Tilbehørtype[]
  produkter: Produkttype[]
}) {
  const { kanEndreHmsnr } = useSaksregler()
  return (
    <VStack gap="space-16">
      {tilbehør.map((t, idx) => {
        const produkt = produkter.find((p) => p.hmsArtNr === t.hmsArtNr)
        return <Tilbehør key={idx} tilbehør={t} produkt={produkt} kanEndreHmsnr={kanEndreHmsnr} />
      })}
    </VStack>
  )
}

export function Tilbehør({
  tilbehør,
  frittståendeTilbehør = false,
  kanEndreHmsnr,
}: {
  tilbehør: Tilbehørtype
  produkt?: Produkttype
  frittståendeTilbehør?: boolean
  kanEndreHmsnr: boolean
}) {
  const harOpplysninger = tilbehør.opplysninger && tilbehør.opplysninger.length > 0
  const harSaksbehandlingvarsel = tilbehør.saksbehandlingvarsel && tilbehør.saksbehandlingvarsel.length > 0

  return (
    <>
      <VStack gap="space-4">
        <HStack gap="space-12">
          <ProduktEksperiment hmsnr={tilbehør.hmsArtNr || '-'} navn={tilbehør.navn || '-'} />
        </HStack>
        <VStack paddingBlock={'space-8 0'}>
          <Etikett>Antall</Etikett>
          <div>
            <AntallTag antall={tilbehør.antall} />
          </div>
        </VStack>
        {harSaksbehandlingvarsel && (
          <Box>
            <Varsler varsler={tilbehør.saksbehandlingvarsel!} />
          </Box>
        )}
        {harOpplysninger && (
          <Box>
            <Opplysninger opplysninger={tilbehør.opplysninger!} />
          </Box>
        )}
        {!frittståendeTilbehør && <Begrunnelse tilbehør={tilbehør} />}
        {kanEndreHmsnr && (
          <div>
            <Button
              variant="tertiary"
              size="xsmall"
              icon={<PencilIcon />}
              onClick={() => {
                alert('Endre tilbehør - ikke implementert i eksperiment enda')
              }}
            >
              Endre tilbehør
            </Button>
          </div>
        )}
      </VStack>
    </>
  )
}

function Begrunnelse({ tilbehør }: { tilbehør: Tilbehørtype }) {
  return (
    <>
      {tilbehør.begrunnelse && (
        <TextContainer>
          <HStack gap="space-4" align="center">
            <Etikett>Begrunnelse:</Etikett>
            <BrytbarBrødtekst>{tilbehør.begrunnelse}</BrytbarBrødtekst>
          </HStack>
        </TextContainer>
      )}

      {tilbehør.fritakFraBegrunnelseÅrsak && (
        <TextContainer>
          <Brødtekst>Begrunnelse ikke påkrevd for dette tilbehøret.</Brødtekst>
        </TextContainer>
      )}
    </>
  )
}
