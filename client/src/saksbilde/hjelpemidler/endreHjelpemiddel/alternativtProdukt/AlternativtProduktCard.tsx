import { Box, Checkbox, HStack, Tag, VStack } from '@navikt/ds-react'

import classes from './AlternativtProduktCard.module.css'

import clsx from 'clsx'
import { Produktbilde } from '../../../../felleskomponenter/bilde/Produktbilde.tsx'
import { produktbildeUri } from '../../../../felleskomponenter/bilde/produktbildeUri.ts'
import { FinnHjelpemiddelLink } from '../../../../felleskomponenter/FinnHjelpemiddelLink.tsx'
import { Etikett, Tekst } from '../../../../felleskomponenter/typografi.tsx'
import type { AlternativeProduct } from '../../useAlternativeProdukter.ts'
import { LagerstatusUtregning } from './LagerstatusUtregning.tsx'

interface AlternativProduktCardProps {
  alternativtProdukt: AlternativeProduct
  endretProdukt: string
}

export function AlternativtProduktCard({ alternativtProdukt, endretProdukt }: AlternativProduktCardProps) {
  const bildeUri = produktbildeUri(alternativtProdukt.media)

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
        <HStack wrap={false} gap="space-12" align="start" justify="space-between">
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
          {bildeUri && <Produktbilde src={bildeUri} alt={alternativtProdukt.articleName || alternativtProdukt.title} />}
        </HStack>
      </VStack>
      <Box background="accent-soft" padding="space-8" borderRadius="12">
        <Checkbox value={alternativtProdukt.hmsArtNr}>Bytt til denne</Checkbox>
      </Box>
    </Box>
  )
}
