import { Box, Checkbox, HGrid, Tag, VStack } from '@navikt/ds-react'
import styled from 'styled-components'

import { FinnHjelpemiddelLink } from '../../../../felleskomponenter/FinnHjelpemiddelLink.tsx'
import { Brødtekst, Etikett } from '../../../../felleskomponenter/typografi.tsx'
import type { AlternativeProduct } from '../../useAlternativeProdukter.ts'

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
              <Brødtekst>{`Hmsnr: ${alternativtProdukt.hmsArtNr}`}</Brødtekst>
            </FinnHjelpemiddelLink>
            <VStack paddingBlock="space-12" gap="space-8">
              <Brødtekst>{alternativtProdukt.supplier.name}</Brødtekst>
              {alternativtProdukt.wareHouseStock?.map((lagerstatus) => (
                <Box.New key={lagerstatus?.location}>
                  <Etikett>{lagerstatus?.location}: </Etikett>
                  <div>
                    {lagerstatus ? (
                      <Tag variant="success-moderate" size="small">
                        {lagerstatus.amountInStock} stk på lager
                      </Tag>
                    ) : (
                      <Tag variant="success-moderate" size="small">
                        Ukjent
                      </Tag>
                    )}
                  </div>
                </Box.New>
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
      <Box.New background="accent-soft" padding="space-8" borderRadius="xlarge">
        <Checkbox value={alternativtProdukt.hmsArtNr}>Bytt til denne</Checkbox>
      </Box.New>
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
