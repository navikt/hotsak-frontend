import { Button, HStack, Tag, VStack } from '@navikt/ds-react'

import { PencilIcon } from '@navikt/aksel-icons'
import { useState } from 'react'
import { Skillelinje } from '../../../../../felleskomponenter/Strek'
import { BrytbarBrødtekst, Etikett, TextContainer } from '../../../../../felleskomponenter/typografi'
import { Opplysninger } from '../../../../../saksbilde/hjelpemidler/Opplysninger'
import { Utlevert } from '../../../../../saksbilde/hjelpemidler/Utlevert'
import { Varsler } from '../../../../../saksbilde/hjelpemidler/Varsel'
import { EndreHjelpemiddelModal } from '../../../../../saksbilde/hjelpemidler/endreHjelpemiddel/EndreHjelpemiddelModal'
import {
  EndretHjelpemiddelBegrunnelse,
  EndretHjelpemiddelBegrunnelseLabel,
} from '../../../../../saksbilde/hjelpemidler/endreHjelpemiddel/endreProduktTypes'
import { useEndreHjelpemiddel } from '../../../../../saksbilde/hjelpemidler/endreHjelpemiddel/useEndreHjelpemiddel'
import { type AlternativeProduct } from '../../../../../saksbilde/hjelpemidler/useAlternativeProdukter'
import { useSaksregler } from '../../../../../saksregler/useSaksregler'
import { Hjelpemiddel as HjelpemiddelType } from '../../../../../types/BehovsmeldingTypes'
import { Produkt as ProduktType, Sak } from '../../../../../types/types.internal'
import { storForbokstavIOrd } from '../../../../../utils/formater'
import { AntallTag } from '../../felleskomponenter/AntallTag'
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
  const produkt = produkter.find((p) => p.hmsnr === hjelpemiddel.produkt.hmsArtNr)
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
  const endretHjelpemiddel = endretHjelpemiddelResponse?.endretHjelpemiddel
  const harAlternativeProdukter = alternativeProdukter.length > 0
  const [visAlternativerModal, setVisAlternativerModal] = useState(false)

  return (
    <>
      <VStack key={hjelpemiddel.produkt.hmsArtNr} paddingBlock="space-8" gap="space-12" paddingInline="space-12">
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
        <>
          <VStack justify="start" gap="2">
            {endretHjelpemiddel && (
              <ProduktEksperiment
                hmsnr={endretHjelpemiddelResponse.hmsArtNr}
                navn={endretHjelpemiddelProdukt?.navn || '-'}
                showLink={endretHjelpemiddelProdukt?.kilde !== 'OeBS'}
              />
            )}
            <HStack gap="space-8">
              <ProduktEksperiment
                hmsnr={hjelpemiddel.produkt.hmsArtNr}
                navn={hjelpemiddel.produkt.artikkelnavn}
                gjennomstrek={endretHjelpemiddel !== undefined}
              />
              {kanEndreHmsnr && (
                <div>
                  <Button
                    variant="tertiary"
                    size="xsmall"
                    icon={<PencilIcon />}
                    onClick={() => {
                      setVisAlternativerModal(true)
                    }}
                  />
                </div>
              )}
            </HStack>
            {endretHjelpemiddel && (
              <div>
                <Etikett>Endret av saksbehandler, begrunnelse:</Etikett>
                <BrytbarBrødtekst>
                  {endretHjelpemiddel?.begrunnelse === EndretHjelpemiddelBegrunnelse.ANNET ||
                  endretHjelpemiddel?.begrunnelse === EndretHjelpemiddelBegrunnelse.ALTERNATIV_PRODUKT_ANNET
                    ? endretHjelpemiddel.begrunnelseFritekst
                    : EndretHjelpemiddelBegrunnelseLabel.get(endretHjelpemiddel?.begrunnelse) ||
                      `${storForbokstavIOrd(endretHjelpemiddel?.begrunnelse)}`}
                </BrytbarBrødtekst>
              </div>
            )}
            <HStack gap="space-8" paddingBlock="0 space-12">
              <AntallTag antall={hjelpemiddel.antall} />
              <Tag size="small" variant="neutral">{`Rangering: ${hjelpemiddel.produkt.rangering}`}</Tag>
              {minmaxStyrt && (
                <Tag variant="neutral" size="small">
                  Min/max lagervare
                </Tag>
              )}
              {harAlternativeProdukter && (
                <Tag size="small" variant="neutral">
                  Alternativer på lager
                </Tag>
              )}
            </HStack>
          </VStack>
          <Skillelinje />
          <VStack gap="space-8" paddingBlock="space-8 0">
            <Varsler varsler={hjelpemiddel.varsler} />
            <Varsler varsler={hjelpemiddel.saksbehandlingvarsel} />
            {hjelpemiddel.varsler || hjelpemiddel.saksbehandlingvarsel ? <Skillelinje /> : null}

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
