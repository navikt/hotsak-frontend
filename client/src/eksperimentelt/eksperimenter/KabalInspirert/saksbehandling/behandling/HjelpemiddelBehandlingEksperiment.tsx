import { Button, HStack, Tag, VStack } from '@navikt/ds-react'
import { useState } from 'react'

import { Etikett, TextContainer } from '../../../../../felleskomponenter/typografi'
import { Produkt } from '../../../../../saksbilde/hjelpemidler/Produkt'
import { EndreHjelpemiddelModal } from '../../../../../saksbilde/hjelpemidler/endreHjelpemiddel/EndreHjelpemiddelModal'
import { useEndreHjelpemiddel } from '../../../../../saksbilde/hjelpemidler/endreHjelpemiddel/useEndreHjelpemiddel'
import { type AlternativeProduct } from '../../../../../saksbilde/hjelpemidler/useAlternativeProdukter'
import { Hjelpemiddel as HjelpemiddelType } from '../../../../../types/BehovsmeldingTypes'
import { Produkt as ProduktType, Sak } from '../../../../../types/types.internal'
import { AntallTag } from '../../felleskomponenter/AntallTag'
import BytteBehandlingEksperiment from './BytteBehandlingEksperiment'
import { useSaksregler } from '../../../../../saksregler/useSaksregler'
import { PencilIcon } from '@navikt/aksel-icons'
import { Skillelinje } from '../../../../../felleskomponenter/Strek'

interface HjelpemiddelBehandlingEksperimentProps {
  sak: Sak
  hjelpemiddel: HjelpemiddelType
  produkter: ProduktType[]
  alternativeProdukter: AlternativeProduct[]
  harOppdatertLagerstatus: boolean
  minmaxStyrt: boolean
}

export function HjelpemiddelBehandlingEksperiment({
  sak,
  hjelpemiddel,
  produkter,
  alternativeProdukter,
  harOppdatertLagerstatus,
}: HjelpemiddelBehandlingEksperimentProps) {
  const { sakId } = sak
  const [visAlternativerModal, setVisAlternativerModal] = useState(false)
  const { kanEndreHmsnr } = useSaksregler()
  const produkt = produkter.find((p) => p.hmsnr === hjelpemiddel.produkt.hmsArtNr)
  const {
    endreHjelpemiddel,
    nåværendeHmsnr,
    endretHjelpemiddel: endretHjelpemiddelResponse,
  } = useEndreHjelpemiddel(sakId, hjelpemiddel)

  const endretHjelpemiddel = endretHjelpemiddelResponse?.endretHjelpemiddel
  const harAlternativeProdukter = alternativeProdukter.length > 0

  return (
    <>
      <VStack key={hjelpemiddel.produkt.hmsArtNr} gap="4">
        <TextContainer>
          <Etikett size="medium">{produkt?.isotittel}</Etikett>
        </TextContainer>
        <TextContainer>
          <VStack justify="start" gap="2">
            <Produkt
              hmsnr={hjelpemiddel.produkt.hmsArtNr}
              navn={hjelpemiddel.produkt.artikkelnavn}
              gjennomstrek={endretHjelpemiddel !== undefined}
            />
            <HStack gap="2">
              <AntallTag antall={hjelpemiddel.antall} />
              <Tag size="small" variant="neutral">{`Rangering: ${hjelpemiddel.produkt.rangering}`}</Tag>
            </HStack>
          </VStack>
          <VStack gap="3" paddingBlock="4 0" paddingInline="4 0">
            {hjelpemiddel.bytter && hjelpemiddel.bytter.length > 0 && (
              <BytteBehandlingEksperiment bytter={hjelpemiddel.bytter} />
            )}
          </VStack>
        </TextContainer>
      </VStack>
      {kanEndreHmsnr && (
        <>
          <Skillelinje color="info" />
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
        </>
      )}
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
