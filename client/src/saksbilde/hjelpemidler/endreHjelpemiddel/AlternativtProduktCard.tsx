import { Box, Button, HStack, Tag, VStack } from '@navikt/ds-react'
import { Brødtekst, Etikett, Undertittel } from '../../../felleskomponenter/typografi.tsx'
import { AlternativeProduct } from '../../../generated/finnAlternativprodukt.ts'
import { formaterTidsstempelLesevennlig } from '../../../utils/dato.ts'

interface AlternativtProduktCardProps {
  alternativtProdukt: AlternativeProduct
}

export function AlternativtProduktCard(props: AlternativtProduktCardProps) {
  const { alternativtProdukt } = props

  return (
    <Box borderWidth="1" borderColor="border-subtle" borderRadius={'large'} padding="4">
      <VStack>
        <Etikett size="small">
          {alternativtProdukt.hmsArtNr}: {alternativtProdukt.title}
        </Etikett>
        <Brødtekst>{alternativtProdukt.supplier.name}</Brødtekst>
        {alternativtProdukt.wareHouseStock?.map((lagerstatus) => (
          <>
            <HStack gap="2">
              <Etikett>{lagerstatus?.location}</Etikett>
              <div>
                <Tag variant="success" size="xsmall">
                  {lagerstatus?.available} stk på lager
                </Tag>
              </div>
            </HStack>
            <Undertittel> {formaterTidsstempelLesevennlig(lagerstatus?.updated)}</Undertittel>
          </>
        ))}

        <HStack gap="2" paddingBlock={'4 0'}>
          <div>
            <Button variant="secondary-neutral" size="small">
              Sjekk på nytt
            </Button>
          </div>
          <div>
            <Button variant="secondary" size="small">
              Bytt til denne
            </Button>
          </div>
        </HStack>
      </VStack>
    </Box>
  )
}
