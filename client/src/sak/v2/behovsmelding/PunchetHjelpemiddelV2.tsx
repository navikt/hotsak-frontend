import { CompactExpandableCard } from '../../../felleskomponenter/panel/CompactExpandableCard.tsx'
import { Produktbilde } from '../../../felleskomponenter/bilde/Produktbilde.tsx'
import { ResponsiveStack } from '../../../felleskomponenter/ResponsiveStack.tsx'
import { useHjelpemiddelprodukt } from '../../../saksbilde/hjelpemidler/useHjelpemiddelprodukter.ts'
import { AntallTag } from '../AntallTag.tsx'
import { ProduktV2 } from './ProduktV2.tsx'
import { HStack, VStack } from '@navikt/ds-react'
import { type PunchetHjelpemiddel } from '../../../journalføring/journalføringTypes.ts'

interface PunchetHjelpemiddelV2Props {
  hjelpemiddel: PunchetHjelpemiddel
}

export function PunchetHjelpemiddelV2({ hjelpemiddel }: PunchetHjelpemiddelV2Props) {
  const { data: produkt } = useHjelpemiddelprodukt(hjelpemiddel.hmsnummer)

  return (
    <CompactExpandableCard
      tittel={
        <>
          {produkt?.isotittel || 'Mangler kategori'}
          <span className="sr-only">: {produkt?.artikkelnavn ?? hjelpemiddel.hmsnummer}</span>
        </>
      }
    >
      <ResponsiveStack>
        <VStack gap="space-12">
          <VStack justify="start" gap="space-8">
            <ProduktV2 hmsnr={hjelpemiddel.hmsnummer} navn={produkt?.artikkelnavn ?? 'Ukjent produkt'} />
            <HStack gap="space-4" align="center">
              <AntallTag antall={hjelpemiddel.antall} />
            </HStack>
          </VStack>
        </VStack>
        {produkt && <Produktbilde src={produkt.produktbildeUri} alt={produkt.artikkelnavn} size="small" />}
      </ResponsiveStack>
    </CompactExpandableCard>
  )
}
