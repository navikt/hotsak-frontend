import { Box, Checkbox, HGrid, HStack, Link, Skeleton, Tag, VStack } from '@navikt/ds-react'
import React from 'react'
import styled from 'styled-components'

import { Brødtekst, Etikett, Undertittel } from '../../../felleskomponenter/typografi'
import type { AlternativeProduct } from '../useAlternativeProdukter.ts'
import { formaterRelativTid } from '../../../utils/dato'

interface AlternativProduktCardProps {
  alternativtProdukt: AlternativeProduct
  endretProdukt: string[]
}

export function AlternativtProduktCard({ alternativtProdukt, endretProdukt }: AlternativProduktCardProps) {
  const imageProxyUrl = window.appSettings.IMAGE_PROXY_URL

  function produktBilde(produkt: AlternativeProduct): Maybe<string> {
    const media = produkt.media
      .filter((m) => m.type === 'IMAGE')
      .sort((a, b) => (Number(a.priority) ?? 0) - (Number(b.priority) ?? 0))[0]

    if (!media || !media.uri) {
      return undefined
    }
    return `${imageProxyUrl}/${media.uri}`
  }

  return (
    <VStack>
      <ProduktCard
        key={alternativtProdukt.id}
        borderWidth="1"
        borderColor="border-subtle"
        borderRadius={'large'}
        padding="4"
        selected={endretProdukt.includes(alternativtProdukt.hmsArtNr)}
      >
        <VStack gap="3">
          <HStack justify={'center'} paddingBlock={'2 4'}>
            {produktBilde(alternativtProdukt) && <img src={produktBilde(alternativtProdukt)} width="180px" />}
          </HStack>
          <VStack>
            <Etikett size="small">
              <Link href={`https://finnhjelpemiddel.nav.no/${alternativtProdukt.hmsArtNr}`} target="_blank">
                {alternativtProdukt.articleName || alternativtProdukt.title}
              </Link>
            </Etikett>
            <Undertittel>{`Hmsnr: ${alternativtProdukt.hmsArtNr}`}</Undertittel>
            <Brødtekst>{alternativtProdukt.supplier.name}</Brødtekst>
          </VStack>
          <HGrid columns={'auto 1fr'} gap="2 2" align="center">
            {alternativtProdukt.wareHouseStock?.map((lagerstatus) => (
              <React.Fragment key={lagerstatus?.location}>
                <Etikett>{lagerstatus?.location}: </Etikett>
                {false ? (
                  <Skeleton variant="rectangle" width={100} height={25} />
                ) : (
                  <div>
                    {lagerstatus ? (
                      <Tag variant="success" size="small">
                        {lagerstatus.amountInStock} stk på lager
                      </Tag>
                    ) : (
                      <Tag variant="warning-moderate" size="small">
                        Ukjent
                      </Tag>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </HGrid>
          <div>
            <Undertittel>{`Oppdatert: ${formaterRelativTid(alternativtProdukt?.wareHouseStock?.[0]?.updated)}`}</Undertittel>
          </div>
        </VStack>
      </ProduktCard>
      <HStack justify={'center'} paddingBlock="2 0">
        <Checkbox value={alternativtProdukt.hmsArtNr}>Bytt til denne</Checkbox>
      </HStack>
    </VStack>
  )
}

const ProduktCard = styled(Box)<{ selected?: boolean }>`
  border: ${({ selected }) => selected && '4px solid var(--a-border-selected)'};
  margin: ${({ selected }) => selected && '-3px'};
`
