import { HStack, Tag, VStack } from '@navikt/ds-react'

import { BrytbarBrødtekst, Etikett, TextContainer } from '../../../../../felleskomponenter/typografi'
import Bytter from '../../../../../saksbilde/hjelpemidler/Bytter'
import { Opplysninger } from '../../../../../saksbilde/hjelpemidler/Opplysninger'
import { Produkt } from '../../../../../saksbilde/hjelpemidler/Produkt'
import { Utlevert } from '../../../../../saksbilde/hjelpemidler/Utlevert'
import { Varsler } from '../../../../../saksbilde/hjelpemidler/Varsel'
import { type AlternativeProduct } from '../../../../../saksbilde/hjelpemidler/useAlternativeProdukter'
import { Hjelpemiddel as HjelpemiddelType } from '../../../../../types/BehovsmeldingTypes'
import { Produkt as ProduktType, Sak } from '../../../../../types/types.internal'
import { AntallTag } from '../../felleskomponenter/AntallTag'
import { TilbehørListeEksperiment } from './TilbehørListeEksperiment'

interface HjelpemiddelProps {
  sak: Sak
  hjelpemiddel: HjelpemiddelType
  produkter: ProduktType[]
  alternativeProdukter: AlternativeProduct[]
  harOppdatertLagerstatus: boolean
  minmaxStyrt: boolean
}

export function HjelpemiddelEksperiment({ hjelpemiddel, produkter }: HjelpemiddelProps) {
  const produkt = produkter.find((p) => p.hmsnr === hjelpemiddel.produkt.hmsArtNr)

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
      <>
        <TextContainer>
          <VStack justify="start" gap="2">
            <HStack gap="2">
              <Produkt hmsnr={hjelpemiddel.produkt.hmsArtNr} navn={hjelpemiddel.produkt.artikkelnavn} />
              <AntallTag antall={hjelpemiddel.antall} />
              <Tag size="small" variant="neutral">{`Rangering: ${hjelpemiddel.produkt.rangering}`}</Tag>
            </HStack>
          </VStack>
          <VStack gap="3" paddingBlock="4 0" paddingInline="4 0">
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
      </>
      <>
        {hjelpemiddel.tilbehør.length > 0 && (
          <VStack gap="3">
            <Etikett size="medium">Tilbehør</Etikett>
            <TilbehørListeEksperiment tilbehør={hjelpemiddel.tilbehør} produkter={produkter} />
          </VStack>
        )}
      </>
    </VStack>
  )
}
