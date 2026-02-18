import { Box, Checkbox, HGrid, HStack, Tag, VStack } from '@navikt/ds-react'
import styled from 'styled-components'

import { FinnHjelpemiddelLink } from '../../../../felleskomponenter/FinnHjelpemiddelLink.tsx'
import { Etikett, Tekst } from '../../../../felleskomponenter/typografi.tsx'
import type { AlternativeProduct } from '../../useAlternativeProdukter.ts'
import { LagerstatusUtregning } from './LagerstatusUtregning.tsx'

interface AlternativProduktCardProps {
  alternativtProdukt: AlternativeProduct
  endretProdukt: string
}

export function AlternativtProduktCard({ alternativtProdukt, endretProdukt }: AlternativProduktCardProps) {
  const imageProxyUrl = window.appSettings.IMAGE_PROXY_URL

  function produktbilde(produkt: AlternativeProduct): Maybe<string> {
    const media = produkt.media
      .filter((m) => m.type === 'IMAGE')
      .sort((a, b) => (Number(a.priority) ?? 0) - (Number(b.priority) ?? 0))[0]
    if (!media || !media.uri) {
      return undefined
    }
    return `${imageProxyUrl}/${media.uri}`
  }

  return (
    <ProduktCard
      key={alternativtProdukt.id}
      height="100%"
      borderWidth="1"
      borderColor="neutral-subtle"
      borderRadius="large"
      paddingBlock="space-16 space-8"
      paddingInline="space-16"
      selected={endretProdukt === alternativtProdukt.hmsArtNr}
    >
      <VStack>
        <Etikett size="small" spacing>
          {alternativtProdukt.articleName || alternativtProdukt.title}
        </Etikett>
        <HGrid columns="1fr 1fr">
          <VStack gap="space-4">
            <FinnHjelpemiddelLink hmsnr={alternativtProdukt.hmsArtNr}>
              <Tekst>{`Hmsnr: ${alternativtProdukt.hmsArtNr}`}</Tekst>
            </FinnHjelpemiddelLink>
            <VStack paddingBlock="space-12" gap="space-8">
              <Tekst>{alternativtProdukt.supplier.name}</Tekst>
              {alternativtProdukt.wareHouseStock?.map((lagerstatus) => (
                <Box key={lagerstatus?.location}>
                  <Etikett>{lagerstatus?.location}: </Etikett>
                  <div>
                    {lagerstatus ? (
                      <HStack gap="space-4">
                        <>
                          <Tag data-color="success" variant="moderate" size="small">
                            {lagerstatus.amountInStock} stk på lager
                          </Tag>
                          <LagerstatusUtregning lagerstatus={lagerstatus} />
                        </>
                      </HStack>
                    ) : (
                      <Tag data-color="success" variant="moderate" size="small">
                        Ukjent
                      </Tag>
                    )}
                  </div>
                </Box>
              ))}
            </VStack>
          </VStack>
          {produktbilde(alternativtProdukt) && (
            <div
              style={{
                height: '170px',
                position: 'relative',
                margin: 'auto',
                marginBottom: 'var(--ax-space-16)',
              }}
            >
              <Bilde alt="Produktbilde" src={produktbilde(alternativtProdukt)} />
            </div>
          )}
        </HGrid>
      </VStack>
      <Box background="accent-soft" padding="space-8" borderRadius="xlarge">
        <Checkbox value={alternativtProdukt.hmsArtNr}>Bytt til denne</Checkbox>
      </Box>
    </ProduktCard>
  )
}

const Bilde = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: var(--ax-radius-12);
`

const ProduktCard = styled(Box.New)<{ selected?: boolean }>`
  border: ${({ selected }) => selected && '4px solid var(--ax-border-accent)'};
  margin: ${({ selected }) => selected && '-3px'};
`
