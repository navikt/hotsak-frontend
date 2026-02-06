import { PencilIcon } from '@navikt/aksel-icons'
import { Button, HStack, Tag, VStack } from '@navikt/ds-react'

import { useState } from 'react'
import { Skillelinje } from '../../../felleskomponenter/Strek.tsx'
import { BrytbarBrødtekst, Brødtekst, Etikett, Tekst, TextContainer } from '../../../felleskomponenter/typografi.tsx'
import { EndretArtikkelBegrunnelse, EndretArtikkelBegrunnelseLabel } from '../../sakTypes.ts'
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
import { AntallTag } from '../AntallTag.tsx'
import BytterEksperiment from './BytterEksperiment'
import { ProduktEksperiment } from './ProduktEksperiment'
import { TilbehørListeEksperiment } from './TilbehørListeEksperiment'

interface HjelpemiddelProps {
  sak: Sak
  hjelpemiddel: HjelpemiddelType
  produkter: ProduktType[]
  alternativeProdukter: AlternativeProduct[]
  harOppdatertLagerstatus: boolean
  minmaxStyrt: boolean
}

export function HjelpemiddelEksperiment({
  hjelpemiddel,
  produkter,
  sak,
  minmaxStyrt,
  harOppdatertLagerstatus,
  alternativeProdukter,
}: HjelpemiddelProps) {
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
          <VStack gap="1">
            {produkt?.delkontrakter?.map(({ posttittel }) => (
              <TextContainer key={posttittel}>
                <BrytbarBrødtekst>Delkontrakt {posttittel}</BrytbarBrødtekst>
              </TextContainer>
            ))}
          </VStack>
        </TextContainer>

        <>
          <VStack justify="start" gap="2">
            {endretHjelpemiddel && (
              <ProduktEksperiment
                hmsnr={endretHjelpemiddelResponse.hmsArtNr}
                navn={endretHjelpemiddelProdukt?.artikkelnavn || '-'}
                showLink={endretHjelpemiddelProdukt?.kilde !== 'OeBS'}
              />
            )}
            <HStack gap="space-8">
              <ProduktEksperiment
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
                <Brødtekst textColor="subtle">|</Brødtekst>
              </div>
              <AntallTag antall={hjelpemiddel.antall} />
              {minmaxStyrt && (
                <>
                  <div>
                    <Brødtekst textColor="subtle">|</Brødtekst>
                  </div>
                  <Tekst>Min/max lagervare</Tekst>
                </>
              )}
              {harAlternativeProdukter && (
                <>
                  <div>
                    <Brødtekst textColor="subtle">|</Brødtekst>
                  </div>
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
            {hjelpemiddel.bytter && hjelpemiddel.bytter.length > 0 && (
              <BytterEksperiment bytter={hjelpemiddel.bytter} />
            )}
          </VStack>
        </>

        <>
          {hjelpemiddel.tilbehør.length > 0 && (
            <>
              <Skillelinje />
              <VStack gap="space-12">
                <Etikett size="small">Tilbehør</Etikett>
                <TilbehørListeEksperiment tilbehør={hjelpemiddel.tilbehør} produkter={produkter} />
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
