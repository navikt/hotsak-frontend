import { PencilIcon } from '@navikt/aksel-icons'
import { Box, Button, HStack, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { BrytbarBrødtekst, Etikett, Tekst, TextContainer } from '../../../../felleskomponenter/typografi'
import { EndreTilbehørModal } from '../../../../saksbilde/hjelpemidler/endreHjelpemiddel/EndreTilbehørModal'
import { useEndreHjelpemiddel } from '../../../../saksbilde/hjelpemidler/endreHjelpemiddel/useEndreHjelpemiddel'
import { Opplysninger } from '../../../../saksbilde/hjelpemidler/Opplysninger'
import { Varsler } from '../../../../saksbilde/hjelpemidler/Varsel'
import { useSaksregler } from '../../../../saksregler/useSaksregler'
import { Tilbehør as Tilbehørtype } from '../../../../types/BehovsmeldingTypes'
import { Produkt as Produkttype } from '../../../../types/types.internal'
import { AntallTag } from '../../AntallTag'
import { ProduktV2 } from '../ProduktV2'
import { EndretTilbehørBegrunnelse } from './EndretTilbehørBegrunnelse'

export function FrittStåendeTilbehørV2({
  sakId,
  tilbehør,
  produkter,
}: {
  sakId: string
  tilbehør: Tilbehørtype[]
  produkter: Produkttype[]
}) {
  const { kanEndreHmsnr } = useSaksregler()
  return (
    <VStack gap="4">
      {tilbehør.map((t, idx) => {
        const produkt = produkter.find((p) => p.hmsArtNr === t.hmsArtNr)

        return (
          <Box
            key={idx}
            borderRadius="large"
            padding="4"
            background="neutral-softA"
            borderColor="neutral-subtle"
            borderWidth="1"
          >
            <Tilbehør
              tilbehør={t}
              sakId={sakId}
              produkt={produkt}
              frittståendeTilbehør={true}
              kanEndreHmsnr={kanEndreHmsnr}
            />
          </Box>
        )
      })}
    </VStack>
  )
}

export function TilbehørlisteV2({
  sakId,
  tilbehør,
  produkter,
}: {
  sakId: string
  tilbehør: Tilbehørtype[]
  produkter: Produkttype[]
}) {
  const { kanEndreHmsnr } = useSaksregler()

  return (
    <VStack gap="space-16">
      {tilbehør.map((t, idx) => {
        const produkt = produkter.find((p) => p.hmsArtNr === t.hmsArtNr)
        return <Tilbehør key={idx} sakId={sakId} tilbehør={t} produkt={produkt} kanEndreHmsnr={kanEndreHmsnr} />
      })}
    </VStack>
  )
}

function Tilbehør({
  sakId,
  tilbehør,
  produkt,
  frittståendeTilbehør = false,
  kanEndreHmsnr,
}: {
  sakId: string
  tilbehør: Tilbehørtype
  produkt?: Produkttype
  frittståendeTilbehør?: boolean
  kanEndreHmsnr: boolean
}) {
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
      <VStack gap="space-4">
        {harEndretTilbehør && (
          <ProduktV2
            hmsnr={endretHjelpemiddelResponse.hmsArtNr}
            navn={endretHjelpemiddelProdukt?.artikkelnavn || '-'}
            showLink={endretHjelpemiddelProdukt?.kilde !== 'OeBS'}
          />
        )}
        <HStack gap="space-12">
          <ProduktV2 hmsnr={tilbehør.hmsArtNr || '-'} navn={tilbehør.navn || '-'} />
        </HStack>
        <VStack paddingBlock={'space-8 0'}>
          <Etikett>Antall</Etikett>
          <div>
            <AntallTag antall={tilbehør.antall} />
          </div>
        </VStack>
        {harEndretTilbehør && (
          <Box paddingInline="4 0">
            <Etikett>Endret av saksbehandler, begrunnelse:</Etikett>
            <EndretTilbehørBegrunnelse endretTilbehør={endretTilbehør} />
          </Box>
        )}
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
                setVisAlternativerModal(true)
              }}
            >
              Endre tilbehør
            </Button>
          </div>
        )}
      </VStack>
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
        <TextContainer>
          <HStack gap="space-4" align="center">
            <Etikett>Begrunnelse:</Etikett>
            <BrytbarBrødtekst>{tilbehør.begrunnelse}</BrytbarBrødtekst>
          </HStack>
        </TextContainer>
      )}

      {tilbehør.fritakFraBegrunnelseÅrsak && (
        <TextContainer>
          <Tekst>Begrunnelse ikke påkrevd for dette tilbehøret.</Tekst>
        </TextContainer>
      )}
    </>
  )
}
