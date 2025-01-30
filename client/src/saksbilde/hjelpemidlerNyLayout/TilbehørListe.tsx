import { Box, VStack } from '@navikt/ds-react'
import { Brødtekst, Etikett, TextContainer } from '../../felleskomponenter/typografi'
import { FritakFraBegrunnelseÅrsak, Tilbehør as Tilbehørtype } from '../../types/BehovsmeldingTypes'
import { Produkt as Produkttype } from '../../types/types.internal'
import { HjelpemiddelGrid } from './HjelpemiddelGrid'
import { Opplysninger } from './Opplysninger'
import { Produkt } from './Produkt'

export function FrittStåendeTilbehør({ tilbehør, produkter }: { tilbehør: Tilbehørtype[]; produkter: Produkttype[] }) {
  return (
    <VStack gap="4">
      {tilbehør.map((t, idx) => {
        const produkt = produkter.find((p) => p.hmsnr === t.hmsArtNr)

        return (
          <Box background="surface-subtle" padding="4">
            <HjelpemiddelGrid key={idx}>
              <TextContainer>
                <VStack gap="1">
                  <Produkt hmsnr={t.hmsArtNr || '-'} navn={t.navn || '-'} linkTo={produkt?.produkturl} />
                  {t.opplysninger && (
                    <Box paddingInline="4 0">
                      <Opplysninger opplysninger={t.opplysninger} />
                    </Box>
                  )}
                </VStack>
              </TextContainer>
              <div style={{ paddingTop: 2 }}>{t.antall} stk</div>
              <div />
            </HjelpemiddelGrid>
          </Box>
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

        return (
          <HjelpemiddelGrid key={idx}>
            <TextContainer>
              <VStack gap="1">
                <Produkt hmsnr={t.hmsArtNr || '-'} navn={t.navn || '-'} linkTo={produkt?.produkturl} />
                <Begrunnelse tilbehør={t} />
                {/*t.opplysninger && (
                  <Box paddingInline="4 0">
                    <Opplysninger opplysninger={t.opplysninger} />
                  </Box>
                )*/}
              </VStack>
            </TextContainer>
            <div style={{ paddingTop: 2 }}>{t.antall} stk</div>
            <div />
          </HjelpemiddelGrid>
        )
      })}
    </VStack>
  )
}

function Begrunnelse({ tilbehør }: { tilbehør: Tilbehørtype }) {
  return (
    <>
      {tilbehør.begrunnelse && (
        <Box paddingInline="4 0">
          <Etikett>Begrunnelse</Etikett>
          <Brødtekst>{tilbehør.begrunnelse}</Brødtekst>
        </Box>
      )}

      {tilbehør.fritakFraBegrunnelseÅrsak === FritakFraBegrunnelseÅrsak.ER_PÅ_BESTILLINGSORDNING ||
        (tilbehør.fritakFraBegrunnelseÅrsak === FritakFraBegrunnelseÅrsak.ER_SELVFORKLARENDE_TILBEHØR && (
          <Box paddingInline="4 0">
            <Brødtekst>Begrunnelse ikke påkrevd for dette tilbehøret.</Brødtekst>
          </Box>
        ))}
    </>
  )
}
