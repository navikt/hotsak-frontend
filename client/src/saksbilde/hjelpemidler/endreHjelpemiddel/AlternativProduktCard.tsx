import { Box, Button, Checkbox, HGrid, HStack, Tag, VStack } from '@navikt/ds-react'
import { AlternativeProduct } from '../../../generated/finnAlternativprodukt'
import { Brødtekst, Etikett, Undertittel } from '../../../felleskomponenter/typografi'
import { formaterRelativTid } from '../../../utils/dato'
import { ClockDashedIcon } from '@navikt/aksel-icons'
import { useSjekkLagerstatus } from '../useSjekkLagerstatus'

interface AlternativProduktCardProps {
  alternativ: AlternativeProduct
  onMutate: () => void
  endretProdukt: string[]
}

export function AlternativProduktCard({ alternativ, onMutate }: AlternativProduktCardProps) {
  const { sjekkLagerstatus, loading: henterLagerstatus } = useSjekkLagerstatus()

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
    <Box key={alternativ.id} borderWidth="1" borderColor="border-subtle" borderRadius={'large'} padding="4">
      <HGrid columns="2fr 1fr" gap="2">
        <VStack gap="1">
          <Etikett size="small">
            {alternativ.hmsArtNr}: {alternativ.title}
          </Etikett>
          {alternativ.title.toLowerCase() !== alternativ.articleName.toLowerCase() && (
            <Brødtekst>{alternativ.articleName}</Brødtekst>
          )}
          <Brødtekst>{alternativ.supplier.name}</Brødtekst>
          <HGrid columns={'1fr 1fr'}>
            {alternativ.wareHouseStock?.map((lagerstatus) => (
              <VStack key={lagerstatus?.location}>
                <Etikett>{lagerstatus?.location}: </Etikett>
                <div>
                  <Tag variant="success" size="xsmall">
                    {lagerstatus?.available} stk på lager
                  </Tag>
                </div>
                <div style={{ gridColumn: '1 / -1', paddingTop: '0.2rem' }}>
                  <Undertittel>{formaterRelativTid(lagerstatus?.updated)}</Undertittel>
                </div>
              </VStack>
            ))}
          </HGrid>

          <HStack gap="2" paddingBlock={'4 0'}>
            <div>
              <Button
                variant="tertiary"
                size="small"
                icon={<ClockDashedIcon />}
                loading={henterLagerstatus}
                onClick={async () => {
                  await sjekkLagerstatus([alternativ.hmsArtNr])
                  onMutate()
                }}
              >
                Sjekk lagerstatus
              </Button>
            </div>
          </HStack>
        </VStack>
        <VStack gap="2" paddingBlock={'8 0'}>
          {produktBilde(alternativ) && <img src={produktBilde(alternativ)} width="150px" />}
          <div>
            <Checkbox value={alternativ.hmsArtNr}>Bytt til denne</Checkbox>
          </div>
        </VStack>
      </HGrid>
    </Box>
  )
}
