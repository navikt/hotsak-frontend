import { VStack } from '@navikt/ds-react'
import { Brødtekst, Etikett, TextContainer } from '../../felleskomponenter/typografi'
import { FritakFraBegrunnelseÅrsak, Tilbehør as Tilbehørtype } from '../../types/BehovsmeldingTypes'
import { Produkt as Produkttype } from '../../types/types.internal'
import { HjelpemiddelGrid } from './HjelpemiddelGrid'
import { Opplysninger } from './Opplysninger'
import { Produkt } from './Produkt'

export function TilbehørListe({
  tilbehør,
  frittståendeTilbehør = false,
  produkter,
}: {
  tilbehør: Tilbehørtype[]
  frittståendeTilbehør?: boolean
  produkter: Produkttype[]
}) {
  return tilbehør.map((t, idx) => {
    const produkt = produkter.find((p) => p.hmsnr === t.hmsArtNr)

    return (
      <HjelpemiddelGrid key={idx}>
        <TextContainer>
          <VStack gap="1">
            <Produkt hmsnr={t.hmsArtNr || '-'} navn={t.navn || '-'} linkTo={produkt?.produkturl} />
            {!frittståendeTilbehør && <Begrunnelse tilbehør={t} />}
            {t.opplysninger && <Opplysninger opplysninger={t.opplysninger} />}
          </VStack>
        </TextContainer>
        <div style={{ paddingTop: 5 }}>{t.antall} stk</div>
      </HjelpemiddelGrid>
    )
  })
}

function Begrunnelse({ tilbehør }: { tilbehør: Tilbehørtype }) {
  return (
    <>
      {tilbehør.begrunnelse && (
        <>
          <Etikett>Begrunnelse</Etikett>
          <Brødtekst>{tilbehør.begrunnelse}</Brødtekst>
        </>
      )}

      {tilbehør.fritakFraBegrunnelseÅrsak === FritakFraBegrunnelseÅrsak.ER_PÅ_BESTILLINGSORDNING ||
        (tilbehør.fritakFraBegrunnelseÅrsak === FritakFraBegrunnelseÅrsak.ER_SELVFORKLARENDE_TILBEHØR && (
          <Brødtekst>Begrunnelse ikke påkrevd for dette tilbehøret.</Brødtekst>
        ))}
    </>
  )
}
