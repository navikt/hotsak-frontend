import { PencilIcon } from '@navikt/aksel-icons'
import { Button, HStack, Tag, VStack } from '@navikt/ds-react'

import { useState } from 'react'
import { Skillelinje } from '../../../felleskomponenter/Strek.tsx'
import { BrytbarBrødtekst, Etikett, Tekst, TextContainer } from '../../../felleskomponenter/typografi.tsx'
import Bytter from '../../../saksbilde/hjelpemidler/Bytter.tsx'
import { EndreHjelpemiddelModal } from '../../../saksbilde/hjelpemidler/endreHjelpemiddel/EndreHjelpemiddelModal.tsx'
import { useEndreHjelpemiddel } from '../../../saksbilde/hjelpemidler/endreHjelpemiddel/useEndreHjelpemiddel.tsx'
import { Opplysninger } from '../../../saksbilde/hjelpemidler/Opplysninger.tsx'
import { type AlternativeProduct } from '../../../saksbilde/hjelpemidler/useAlternativeProdukter.ts'
import { Utlevert } from '../../../saksbilde/hjelpemidler/Utlevert.tsx'
import { Varsler } from '../../../saksbilde/hjelpemidler/Varsel.tsx'
import { useSaksregler } from '../../../saksregler/useSaksregler.ts'
import { type Hjelpemiddel as HjelpemiddelType } from '../../../types/BehovsmeldingTypes.ts'
import { type Produkt as ProduktType, Sak } from '../../../types/types.internal.ts'
import { storForbokstavIOrd } from '../../../utils/formater.ts'
import { EndretArtikkelBegrunnelse, EndretArtikkelBegrunnelseLabel } from '../../sakTypes.ts'
import { AntallTag } from '../AntallTag.tsx'
import { ProduktV2 } from './ProduktV2.tsx'
import { TilbehørlisteV2 } from './tilbehør/TilbehørlisteV2.tsx'

interface HjelpemiddelV2Props {
  sak: Sak
  hjelpemiddel: HjelpemiddelType
  produkter: ProduktType[]
  alternativeProdukter: AlternativeProduct[]
  harOppdatertLagerstatus: boolean
  minmaxStyrt: boolean
}

export function HjelpemiddelV2({
  hjelpemiddel,
  produkter,
  sak,
  minmaxStyrt,
  harOppdatertLagerstatus,
  alternativeProdukter,
}: HjelpemiddelV2Props) {
  const produkt = produkter.find((p) => p.hmsArtNr === hjelpemiddel.produkt.hmsArtNr)

  const { kanEndreHmsnr } = useSaksregler()
  const {
    endreHjelpemiddel,
    nåværendeHmsnr,
    endretHjelpemiddelProdukt,
    endretHjelpemiddel: endretHjelpemiddelResponse,
  } = useEndreHjelpemiddel(sak.sakId, {
    id: hjelpemiddel.hjelpemiddelId,
    hmsArtNr: hjelpemiddel.produkt.hmsArtNr,
    navn: hjelpemiddel.produkt.artikkelnavn,
  })
  const endretHjelpemiddel = endretHjelpemiddelResponse?.endretArtikkel
  const harAlternativeProdukter = alternativeProdukter.length > 0
  const [visAlternativerModal, setVisAlternativerModal] = useState(false)

  return (
    <>
      <VStack key={hjelpemiddel.produkt.hmsArtNr} paddingBlock="space-8" gap="space-12" paddingInline="space-12">
        <TextContainer>
          <Etikett size="medium">{produkt?.isotittel}</Etikett>
          <VStack gap="space-4">
            {produkt?.delkontrakter?.map(({ posttittel }) => (
              <TextContainer key={posttittel}>
                <BrytbarBrødtekst>Delkontrakt {posttittel}</BrytbarBrødtekst>
              </TextContainer>
            ))}
          </VStack>
        </TextContainer>

        <>
          <VStack justify="start" gap="space-8">
            {endretHjelpemiddel && (
              <ProduktV2
                hmsnr={endretHjelpemiddelResponse.hmsArtNr}
                navn={endretHjelpemiddelProdukt?.artikkelnavn || '-'}
                showLink={endretHjelpemiddelProdukt?.kilde !== 'OeBS'}
              />
            )}
            <HStack gap="space-8">
              <ProduktV2
                hmsnr={hjelpemiddel.produkt.hmsArtNr}
                navn={hjelpemiddel.produkt.artikkelnavn}
                gjennomstrek={endretHjelpemiddel !== undefined}
              />
            </HStack>
            {endretHjelpemiddel && (
              <div>
                <Etikett>Endret av saksbehandler, begrunnelse:</Etikett>
                <BrytbarBrødtekst>
                  {endretHjelpemiddel?.begrunnelse === EndretArtikkelBegrunnelse.ANNET ||
                  endretHjelpemiddel?.begrunnelse === EndretArtikkelBegrunnelse.ALTERNATIV_PRODUKT_ANNET
                    ? endretHjelpemiddel.begrunnelseFritekst
                    : EndretArtikkelBegrunnelseLabel[endretHjelpemiddel?.begrunnelse] ||
                      `${storForbokstavIOrd(endretHjelpemiddel?.begrunnelse)}`}
                </BrytbarBrødtekst>
              </div>
            )}
            <HStack gap="space-4" align={'center'}>
              {hjelpemiddel.produkt.rangering && hjelpemiddel.produkt.rangering > 1 ? (
                <Tag size="xsmall" variant="warning-moderate">{`Rangering ${hjelpemiddel.produkt.rangering}`}</Tag>
              ) : (
                <Tekst>{`Rangering ${hjelpemiddel.produkt.rangering}`}</Tekst>
              )}
              <div>
                <Tekst textColor="subtle">|</Tekst>
              </div>
              <AntallTag antall={hjelpemiddel.antall} />
              {minmaxStyrt && (
                <>
                  <Tekst textColor="subtle">|</Tekst>
                  <Tekst>Min/max lagervare</Tekst>
                </>
              )}
              {harAlternativeProdukter && (
                <>
                  <Tekst textColor="subtle">|</Tekst>
                  <Tag size="xsmall" variant="info-moderate">
                    Har alternativliste
                  </Tag>
                </>
              )}
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
                    Endre
                  </Button>
                </div>
              )}
            </HStack>
            <Skillelinje />
          </VStack>
          <VStack gap="space-8">
            <Varsler varsler={hjelpemiddel.varsler} />
            <Varsler varsler={hjelpemiddel.saksbehandlingvarsel} />
            <Opplysninger opplysninger={hjelpemiddel.opplysninger} />

            {hjelpemiddel.utlevertinfo.alleredeUtlevertFraHjelpemiddelsentralen && (
              <Utlevert
                alleredeUtlevert={hjelpemiddel.utlevertinfo.alleredeUtlevertFraHjelpemiddelsentralen}
                utlevertInfo={hjelpemiddel.utlevertinfo}
              />
            )}
            {hjelpemiddel.bytter && hjelpemiddel.bytter.length > 0 && <Bytter bytter={hjelpemiddel.bytter} />}
          </VStack>
        </>

        <>
          {hjelpemiddel.tilbehør.length > 0 && (
            <>
              <Skillelinje />
              <VStack gap="space-12">
                <Etikett size="small">Tilbehør</Etikett>
                <TilbehørlisteV2 sakId={sak.sakId} tilbehør={hjelpemiddel.tilbehør} produkter={produkter} />
              </VStack>
            </>
          )}
        </>
      </VStack>
      <EndreHjelpemiddelModal
        åpen={visAlternativerModal}
        hjelpemiddel={hjelpemiddel}
        grunndataProdukt={produkt}
        nåværendeHmsnr={nåværendeHmsnr}
        harOppdatertLagerstatus={harOppdatertLagerstatus}
        alternativeProdukter={alternativeProdukter}
        harAlternativeProdukter={harAlternativeProdukter}
        onLagre={endreHjelpemiddel}
        onLukk={() => setVisAlternativerModal(false)}
      />
    </>
  )
}
