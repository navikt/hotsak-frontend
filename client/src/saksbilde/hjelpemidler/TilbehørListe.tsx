import { PencilIcon } from '@navikt/aksel-icons'
import { Box, Button, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { Eksperiment } from '../../felleskomponenter/Eksperiment'
import { BrytbarBrødtekst, Brødtekst, Etikett, TextContainer } from '../../felleskomponenter/typografi'
import { useSaksregler } from '../../saksregler/useSaksregler'
import { Tilbehør as Tilbehørtype } from '../../types/BehovsmeldingTypes'
import { Produkt as Produkttype } from '../../types/types.internal'
import { storForbokstavIOrd } from '../../utils/formater'
import {
  EndretHjelpemiddelBegrunnelse,
  EndretHjelpemiddelBegrunnelseLabel,
} from './endreHjelpemiddel/endreProduktTypes'
import { EndreTilbehørModal } from './endreHjelpemiddel/EndreTilbehørModal'
import { useEndreHjelpemiddel } from './endreHjelpemiddel/useEndreHjelpemiddel'
import { HjelpemiddelGrid } from './HjelpemiddelGrid'
import { Opplysninger } from './Opplysninger'
import { Produkt } from './Produkt'
import { Varsler } from './Varsel'

export function FrittStåendeTilbehør({
  sakId,
  tilbehør,
  produkter,
}: {
  sakId: string
  tilbehør: Tilbehørtype[]
  produkter: Produkttype[]
}) {
  return (
    <VStack gap="4">
      {tilbehør.map((t, idx) => {
        const produkt = produkter.find((p) => p.hmsnr === t.hmsArtNr)

        return (
          <Box.New key={idx} background="neutral-soft" padding="4">
            <Tilbehør sakId={sakId} tilbehør={t} produkt={produkt} frittståendeTilbehør={true} />
          </Box.New>
        )
      })}
    </VStack>
  )
}

export function TilbehørListe({
  sakId,
  tilbehør,
  produkter,
}: {
  sakId: string
  tilbehør: Tilbehørtype[]
  produkter: Produkttype[]
}) {
  return (
    <VStack gap="4">
      {tilbehør.map((t, idx) => {
        const produkt = produkter.find((p) => p.hmsnr === t.hmsArtNr)
        return <Tilbehør key={idx} sakId={sakId} tilbehør={t} produkt={produkt} />
      })}
    </VStack>
  )
}

export function Tilbehør({
  sakId,
  tilbehør,
  produkt,
  frittståendeTilbehør = false,
}: {
  sakId: string
  tilbehør: Tilbehørtype
  produkt?: Produkttype
  frittståendeTilbehør?: boolean
}) {
  const { kanEndreHmsnr } = useSaksregler()
  const harOpplysninger = tilbehør.opplysninger && tilbehør.opplysninger.length > 0
  const harSaksbehandlingvarsel = tilbehør.saksbehandlingvarsel && tilbehør.saksbehandlingvarsel.length > 0
  const [visAlternativerModal, setVisAlternativerModal] = useState(false)
  const {
    endreHjelpemiddel,
    nåværendeHmsnr,
    endretHjelpemiddelProdukt,
    endretHjelpemiddel: endretHjelpemiddelResponse,
  } = useEndreHjelpemiddel(sakId, {
    id: tilbehør.tilbehørId!,
    hmsArtNr: tilbehør.hmsArtNr || '',
    navn: tilbehør.navn || '',
  })
  const endretTilbehør = endretHjelpemiddelResponse?.endretArtikkel
  return (
    <>
      <HjelpemiddelGrid>
        <TextContainer>
          <VStack gap="1">
            {endretTilbehør && (
              <Produkt
                hmsnr={endretHjelpemiddelResponse.hmsArtNr}
                navn={endretHjelpemiddelProdukt?.navn || '-'}
                showLink={endretHjelpemiddelProdukt?.kilde !== 'OeBS'}
              />
            )}
            <Produkt
              hmsnr={tilbehør.hmsArtNr || '-'}
              navn={tilbehør.navn || '-'}
              gjennomstrek={endretTilbehør !== undefined}
            />
            {harSaksbehandlingvarsel && (
              <Box paddingInline="4 0">
                <Varsler varsler={tilbehør.saksbehandlingvarsel!} />
              </Box>
            )}
            {endretTilbehør && (
              <Box.New paddingInline="4 0">
                <Etikett>Endret av saksbehandler, begrunnelse:</Etikett>
                <BrytbarBrødtekst>
                  {endretTilbehør?.begrunnelse === EndretHjelpemiddelBegrunnelse.ANNET ||
                  endretTilbehør?.begrunnelse === EndretHjelpemiddelBegrunnelse.ALTERNATIV_PRODUKT_ANNET
                    ? endretTilbehør.begrunnelseFritekst
                    : EndretHjelpemiddelBegrunnelseLabel.get(endretTilbehør?.begrunnelse) ||
                      `${storForbokstavIOrd(endretTilbehør?.begrunnelse)}`}
                </BrytbarBrødtekst>
              </Box.New>
            )}
            {harOpplysninger && (
              <Box paddingInline="4 0">
                <Opplysninger opplysninger={tilbehør.opplysninger!} />
              </Box>
            )}
            {!frittståendeTilbehør && <Begrunnelse tilbehør={tilbehør} />}
          </VStack>
        </TextContainer>
        <Brødtekst>{tilbehør.antall} stk</Brødtekst>
        <Eksperiment>
          {kanEndreHmsnr && tilbehør.tilbehørId && (
            <div>
              <Button
                variant="tertiary"
                size="xsmall"
                icon={<PencilIcon />}
                onClick={() => {
                  setVisAlternativerModal(true)
                }}
              >
                Endre
              </Button>
            </div>
          )}
        </Eksperiment>
      </HjelpemiddelGrid>
      <EndreTilbehørModal
        åpen={visAlternativerModal}
        tilbehør={tilbehør}
        grunndataProdukt={produkt}
        nåværendeHmsnr={nåværendeHmsnr}
        onLagre={endreHjelpemiddel}
        onLukk={() => setVisAlternativerModal(false)}
      />
    </>
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
