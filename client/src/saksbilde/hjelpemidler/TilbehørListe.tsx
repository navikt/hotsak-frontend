import { Box, VStack } from '@navikt/ds-react'
import { BrytbarBrødtekst, Brødtekst, Etikett, TextContainer } from '../../felleskomponenter/typografi'
import { Tilbehør as Tilbehørtype } from '../../types/BehovsmeldingTypes'
import { Produkt as Produkttype } from '../../types/types.internal'
import { HjelpemiddelGrid } from './HjelpemiddelGrid'
import { Opplysninger } from './Opplysninger'
import { Produkt } from './Produkt'
import { Varsler } from './Varsel'

export function FrittStåendeTilbehør({ tilbehør, produkter }: { tilbehør: Tilbehørtype[]; produkter: Produkttype[] }) {
  return (
    <VStack gap="4">
      {tilbehør.map((t, idx) => {
        const produkt = produkter.find((p) => p.hmsnr === t.hmsArtNr)

        return (
          <Box.New key={idx} background="neutral-soft" padding="4">
            <Tilbehør tilbehør={t} produkt={produkt} frittståendeTilbehør={true} />
          </Box.New>
        )
      })}
    </VStack>
  )
}

export function TilbehørListe({ tilbehør, produkter }: { tilbehør: Tilbehørtype[]; produkter: Produkttype[] }) {
  return (
    <VStack gap="4">
      {tilbehør.map((t, idx) => {
        const produkt = produkter.find((p) => p.hmsnr === t.hmsArtNr)
        return <Tilbehør key={idx} tilbehør={t} produkt={produkt} />
      })}
    </VStack>
  )
}

export function Tilbehør({
  tilbehør,
  frittståendeTilbehør = false,
}: {
  tilbehør: Tilbehørtype
  produkt?: Produkttype
  frittståendeTilbehør?: boolean
}) {
  const harOpplysninger = tilbehør.opplysninger && tilbehør.opplysninger.length > 0
  const harSaksbehandlingvarsel = tilbehør.saksbehandlingvarsel && tilbehør.saksbehandlingvarsel.length > 0

  return (
    <HjelpemiddelGrid>
      <TextContainer>
        <VStack gap="1">
          <Produkt hmsnr={tilbehør.hmsArtNr || '-'} navn={tilbehør.navn || '-'} />
          {harSaksbehandlingvarsel && (
            <Box paddingInline="4 0">
              <Varsler varsler={tilbehør.saksbehandlingvarsel!} />
            </Box>
          )}
          {harOpplysninger && (
            <Box paddingInline="4 0">
              <Opplysninger opplysninger={tilbehør.opplysninger!} />
            </Box>
          )}
          {!frittståendeTilbehør && <Begrunnelse tilbehør={tilbehør} />}
        </VStack>
      </TextContainer>
      <div style={{ paddingTop: 2 }}>{tilbehør.antall} stk</div>
    </HjelpemiddelGrid>
  )
}

function Begrunnelse({ tilbehør }: { tilbehør: Tilbehørtype }) {
  return (
    <>
      {tilbehør.begrunnelse && (
        <Box paddingInline="4 0">
          <Etikett>Begrunnelse</Etikett>
          <BrytbarBrødtekst>{tilbehør.begrunnelse}</BrytbarBrødtekst>
        </Box>
      )}

      {tilbehør.fritakFraBegrunnelseÅrsak && (
        <Box paddingInline="4 0">
          <Brødtekst>Begrunnelse ikke påkrevd for dette tilbehøret.</Brødtekst>
        </Box>
      )}
    </>
  )
}
