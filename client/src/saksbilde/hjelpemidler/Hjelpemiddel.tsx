import { ArrowsSquarepathIcon, PencilIcon } from '@navikt/aksel-icons'
import { Bleed, Button, HStack, Tag, VStack } from '@navikt/ds-react'
import { useState } from 'react'

import { BrytbarBrødtekst, Brødtekst, Etikett, Tekst, TextContainer } from '../../felleskomponenter/typografi.tsx'
import type { AlternativeProduct } from './useAlternativeProdukter.ts'
import { useSaksregler } from '../../saksregler/useSaksregler.ts'
import { useErOmbrukPilot } from '../../tilgang/useTilgang.ts'
import { Hjelpemiddel as Hjelpemiddeltype } from '../../types/BehovsmeldingTypes.ts'
import {
  EndretHjelpemiddelBegrunnelse,
  EndretHjelpemiddelBegrunnelseLabel,
  Produkt as ProduktType,
  Sak,
} from '../../types/types.internal.ts'
import Bytter from './Bytter.tsx'
import { AlternativeProdukterModal } from './endreHjelpemiddel/AlternativeProdukterModal.tsx'
import { EndreHjelpemiddelModal } from './endreHjelpemiddel/EndreHjelpemiddelModal.tsx'
import { useEndreHjelpemiddel } from './endreHjelpemiddel/useEndreHjelpemiddel.tsx'
import { HjelpemiddelGrid } from './HjelpemiddelGrid.tsx'
import { Opplysninger } from './Opplysninger.tsx'
import { Produkt } from './Produkt.tsx'
import { TilbehørListe } from './TilbehørListe.tsx'
import { Utlevert } from './Utlevert.tsx'
import { Varsler } from './Varsel.tsx'

interface HjelpemiddelProps {
  sak: Sak
  hjelpemiddel: Hjelpemiddeltype
  produkter: ProduktType[]
  alternativer: AlternativeProduct[]
  alleAlternativer: AlternativeProduct[]
}

export function Hjelpemiddel({ sak, hjelpemiddel, produkter, alternativer, alleAlternativer }: HjelpemiddelProps) {
  const { sakId } = sak
  const { kanEndreHmsnr } = useSaksregler()
  const [visEndreHjelpemiddelModal, setVisEndreHjelpemiddelModal] = useState(false)
  const [visAlternativerModal, setVisAlternativerModal] = useState(false)
  const erOmbrukPilot = useErOmbrukPilot()

  const produkt = produkter.find((p) => p.hmsnr === hjelpemiddel.produkt.hmsArtNr)
  const {
    endreHjelpemiddel,
    nåværendeHmsnr,
    endretHjelpemiddelNavn,
    endretHjelpemiddel: endretHjelpemiddelResponse,
  } = useEndreHjelpemiddel(sakId, hjelpemiddel)

  const endretHjelpemiddel = endretHjelpemiddelResponse?.endretHjelpemiddel

  const harAlternativer = alternativer.length > 0

  return (
    <VStack key={hjelpemiddel.produkt.hmsArtNr} gap="4">
      <TextContainer>
        <Etikett size="medium">{produkt?.isotittel}</Etikett>
      </TextContainer>
      <VStack gap="1">
        {produkt?.posttitler?.map((posttittel) => (
          <TextContainer key={posttittel}>
            <BrytbarBrødtekst>Delkontrakt {posttittel}</BrytbarBrødtekst>
          </TextContainer>
        ))}
      </VStack>
      <HjelpemiddelGrid>
        <TextContainer>
          <VStack justify="start" gap="2">
            {endretHjelpemiddel && (
              <Produkt
                hmsnr={endretHjelpemiddelResponse.hmsArtNr}
                navn={endretHjelpemiddelNavn?.navn || '-'}
                gjennomstrek={false}
                // TODO Fiks at vi får tak i url til det nye hjelpemidlet
                //linkTo={produkt?.produkturl}
              />
            )}

            <Produkt
              hmsnr={hjelpemiddel.produkt.hmsArtNr}
              navn={hjelpemiddel.produkt.artikkelnavn}
              gjennomstrek={endretHjelpemiddel !== undefined}
              linkTo={produkt?.produkturl}
            />
            <HStack gap="2">
              <Tag size="small" variant="neutral">{`Rangering: ${hjelpemiddel.produkt.rangering}`}</Tag>
              {harAlternativer && (
                <Tag size="small" variant="info">
                  {alternativer.length} alternativer tilgjengelig
                </Tag>
              )}
            </HStack>
          </VStack>
          <VStack gap="3" paddingBlock="4 0" paddingInline="4 0">
            {endretHjelpemiddel && (
              <div>
                <Etikett>Endret av saksbehandler, begrunnelse:</Etikett>
                <Brødtekst>
                  {endretHjelpemiddel?.begrunnelse === EndretHjelpemiddelBegrunnelse.ANNET ||
                  endretHjelpemiddel?.begrunnelse === EndretHjelpemiddelBegrunnelse.ALTERNATIV_PRODUKT_ANNET
                    ? endretHjelpemiddel.begrunnelseFritekst
                    : EndretHjelpemiddelBegrunnelseLabel.get(endretHjelpemiddel?.begrunnelse)}
                </Brødtekst>
              </div>
            )}
            <Varsler varsler={hjelpemiddel.varsler} />

            {hjelpemiddel.saksbehandlingvarsel && hjelpemiddel.saksbehandlingvarsel.length > 0 && (
              <Varsler varsler={hjelpemiddel.saksbehandlingvarsel} />
            )}

            <Opplysninger opplysninger={hjelpemiddel.opplysninger} />

            {hjelpemiddel.utlevertinfo.alleredeUtlevertFraHjelpemiddelsentralen && (
              <Utlevert
                alleredeUtlevert={hjelpemiddel.utlevertinfo.alleredeUtlevertFraHjelpemiddelsentralen}
                utlevertInfo={hjelpemiddel.utlevertinfo}
              />
            )}
            {hjelpemiddel.bytter && hjelpemiddel.bytter.length > 0 && <Bytter bytter={hjelpemiddel.bytter} />}
          </VStack>
        </TextContainer>

        <div>
          <Tekst>{hjelpemiddel.antall} stk</Tekst>
        </div>
        <VStack gap="2">
          <div>
            {kanEndreHmsnr && (
              <Bleed marginBlock="1 0">
                <Button
                  variant="tertiary"
                  size="xsmall"
                  icon={<PencilIcon />}
                  onClick={() => setVisEndreHjelpemiddelModal(true)}
                >
                  Endre
                </Button>
              </Bleed>
            )}
          </div>
          {erOmbrukPilot && (
            <div>
              {harAlternativer && kanEndreHmsnr && (
                <Bleed marginBlock="1 0">
                  <Button
                    variant="tertiary"
                    size="xsmall"
                    icon={<ArrowsSquarepathIcon />}
                    onClick={() => setVisAlternativerModal(true)}
                  >
                    Alternativer
                  </Button>
                </Bleed>
              )}
            </div>
          )}
        </VStack>
      </HjelpemiddelGrid>
      <>
        <EndreHjelpemiddelModal
          hjelpemiddelId={hjelpemiddel.hjelpemiddelId}
          hmsNr={hjelpemiddel.produkt.hmsArtNr}
          nåværendeHmsNr={nåværendeHmsnr}
          åpen={visEndreHjelpemiddelModal}
          onLagre={endreHjelpemiddel}
          onLukk={() => setVisEndreHjelpemiddelModal(false)}
        />
        {erOmbrukPilot && (
          <AlternativeProdukterModal
            åpen={visAlternativerModal}
            hmsNr={hjelpemiddel.produkt.hmsArtNr}
            hjelpemiddelId={hjelpemiddel.hjelpemiddelId}
            alternativer={alternativer}
            alleAlternativer={alleAlternativer}
            onLagre={endreHjelpemiddel}
            onLukk={() => setVisAlternativerModal(false)}
          />
        )}

        {hjelpemiddel.tilbehør.length > 0 && (
          <VStack gap="3">
            <Etikett size="medium">Tilbehør</Etikett>
            <TilbehørListe tilbehør={hjelpemiddel.tilbehør} produkter={produkter} />
          </VStack>
        )}
      </>
    </VStack>
  )
}
