import { Box, Checkbox, HGrid, HStack, Tag, VStack } from '@navikt/ds-react'

import classes from './AlternativtProduktCard.module.css'

import { FinnHjelpemiddelLink } from '../../../../felleskomponenter/FinnHjelpemiddelLink.tsx'
import { Etikett, Tekst } from '../../../../felleskomponenter/typografi.tsx'
import type { AlternativeProduct } from '../../useAlternativeProdukter.ts'
import { LagerstatusUtregning } from './LagerstatusUtregning.tsx'
import clsx from 'clsx'

interface AlternativProduktCardProps {
  alternativtProdukt: AlternativeProduct
  endretProdukt: string
}

export function AlternativtProduktCard({ alternativtProdukt, endretProdukt }: AlternativProduktCardProps) {
  const imageProxyUrl = window.appSettings.IMAGE_PROXY_URL

  function produktbilde(produkt: AlternativeProduct): Maybe<string> {
    const media = produkt.media
      .filter((m) => m.type === 'IMAGE')
      .sort((a, b) => (Number(a.priority) || 0) - (Number(b.priority) || 0))[0]
    if (!media || !media.uri) {
      return undefined
    }
    return `${imageProxyUrl}/${media.uri}`
  }

  return (
    <Box
      key={alternativtProdukt.id}
      height="100%"
      paddingBlock="space-16 space-8"
      paddingInline="space-16"
      className={clsx(
        classes.produktCard,
        endretProdukt === alternativtProdukt.hmsArtNr && classes.produktCardSelected
      )}
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
              <img className={classes.bilde} alt="Produktbilde" src={produktbilde(alternativtProdukt)} />
            </div>
          )}
        </HGrid>
      </VStack>
      <Box background="accent-soft" padding="space-8" borderRadius="12">
        <Checkbox value={alternativtProdukt.hmsArtNr}>Bytt til denne</Checkbox>
      </Box>
    </Box>
  )
}
