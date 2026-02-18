import { PencilIcon } from '@navikt/aksel-icons'
import { Box, Button, VStack } from '@navikt/ds-react'
import { useState } from 'react'

import { BrytbarBrødtekst, Etikett, Tekst, TextContainer } from '../../felleskomponenter/typografi'
import { EndretTilbehørBegrunnelse } from '../../sak/v2/behovsmelding/tilbehør/EndretTilbehørBegrunnelse.tsx'
import { useSaksregler } from '../../saksregler/useSaksregler'
import { type Tilbehør as Tilbehørtype } from '../../types/BehovsmeldingTypes'
import { type Produkt as Produkttype } from '../../types/types.internal'
import { EndreTilbehørModal } from './endreHjelpemiddel/EndreTilbehørModal'
import { useEndreHjelpemiddel } from './endreHjelpemiddel/useEndreHjelpemiddel'
import { HjelpemiddelGrid } from './HjelpemiddelGrid'
import { Opplysninger } from './Opplysninger'
import { Produkt } from './Produkt'
import { Varsler } from './Varsel'

export function FrittståendeTilbehør({
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
        const produkt = produkter.find((it) => it.hmsArtNr === t.hmsArtNr)

        return (
          <Box key={idx} background="neutral-soft" padding="4">
            <Tilbehør sakId={sakId} tilbehør={t} produkt={produkt} frittståendeTilbehør={true} />
          </Box>
        )
      })}
    </VStack>
  )
}

export function Tilbehørliste({
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
        const produkt = produkter.find((it) => it.hmsArtNr === t.hmsArtNr)
        return <Tilbehør key={idx} sakId={sakId} tilbehør={t} produkt={produkt} />
      })}
    </VStack>
  )
}

function Tilbehør({
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
  const harEndretTilbehør = endretTilbehør && tilbehør.hmsArtNr !== endretHjelpemiddelResponse.hmsArtNr

  return (
    <>
      <HjelpemiddelGrid>
        <TextContainer>
          <VStack gap="1">
            {harEndretTilbehør && (
              <Produkt
                hmsnr={endretHjelpemiddelResponse.hmsArtNr}
                navn={endretHjelpemiddelProdukt?.artikkelnavn || '-'}
                showLink={endretHjelpemiddelProdukt?.kilde !== 'OeBS'}
              />
            )}
            <Produkt hmsnr={tilbehør.hmsArtNr || '-'} navn={tilbehør.navn || '-'} gjennomstrek={harEndretTilbehør} />
            {harSaksbehandlingvarsel && (
              <Box paddingInline="4 0">
                <Varsler varsler={tilbehør.saksbehandlingvarsel!} />
              </Box>
            )}
            {harEndretTilbehør && (
              <Box paddingInline="4 0">
                <Etikett>Endret av saksbehandler, begrunnelse:</Etikett>
                <EndretTilbehørBegrunnelse endretTilbehør={endretTilbehør} />
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
        <div style={{ alignSelf: 'start' }}>
          <Tekst>{tilbehør.antall} stk</Tekst>
        </div>
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
          <Tekst>Begrunnelse ikke påkrevd for dette tilbehøret.</Tekst>
        </Box>
      )}
    </>
  )
}
