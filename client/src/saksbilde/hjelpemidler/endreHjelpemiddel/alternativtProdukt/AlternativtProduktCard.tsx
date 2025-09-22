import { Box, Checkbox, HGrid, Link, Tag, VStack } from '@navikt/ds-react'
import { Fragment } from 'react'
import styled from 'styled-components'

import { Brødtekst, Etikett, Undertittel } from '../../../../felleskomponenter/typografi.tsx'
import { formaterRelativTid } from '../../../../utils/dato.ts'
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
    <VStack gap="3">
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
              <Link href={`https://finnhjelpemiddel.nav.no/${alternativtProdukt.hmsArtNr}`} target="_blank">
                <Brødtekst>{`Hmsnr: ${alternativtProdukt.hmsArtNr}`}</Brødtekst>
              </Link>
              <VStack paddingBlock="space-16">
                <Brødtekst>{alternativtProdukt.supplier.name}</Brødtekst>
                {alternativtProdukt.wareHouseStock?.map((lagerstatus) => (
                  <Fragment key={lagerstatus?.location}>
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
                  </Fragment>
                ))}
                <div>
                  <Undertittel>{`Oppdatert: ${formaterRelativTid(alternativtProdukt?.wareHouseStock?.[0]?.updated)}`}</Undertittel>
                </div>
              </VStack>
            </VStack>
            {produktbilde(alternativtProdukt) && (
              <img
                alt="Produktbilde"
                src={produktbilde(alternativtProdukt)}
                style={{
                  //height: '130px',
                  //maxWidth: '100%',
                  width: '150px',
                  objectFit: 'contain',
                  borderRadius: 'var(--ax-radius-8)',
                }}
              />
            )}
          </HGrid>
        </VStack>
        <Box.New background="accent-soft" padding="space-12" borderRadius="xlarge">
          <Checkbox value={alternativtProdukt.hmsArtNr}>Bytt til denne</Checkbox>
        </Box.New>
      </ProduktCard>
    </VStack>
  )
}

const ProduktCard = styled(Box.New)<{ selected?: boolean }>`
  border: ${({ selected }) => selected && '4px solid var(--ax-border-accent)'};
  margin: ${({ selected }) => selected && '-3px'};

  &:hover {
    border: 4px solid var(--ax-border-accent-strong);
    margin: -3px;
  }
`
