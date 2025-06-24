import { ClockDashedIcon } from '@navikt/aksel-icons'
import { Box, Button, Checkbox, HGrid, HStack, Link, Tag, VStack } from '@navikt/ds-react'
import React from 'react'
import { Brødtekst, Etikett, Undertittel } from '../../../felleskomponenter/typografi'
import { AlternativeProduct } from '../../../generated/finnAlternativprodukt'
import { formaterRelativTid } from '../../../utils/dato'
import { useSjekkLagerstatus } from '../useSjekkLagerstatus'

interface AlternativProduktCardProps {
  alternativ: AlternativeProduct
  onMutate: () => void
  endretProdukt: string[]
}

export function AlternativProduktCard({ alternativ, onMutate }: AlternativProduktCardProps) {
  const { sjekkLagerstatusForProdukt, loading: henterLagerstatus } = useSjekkLagerstatus()

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
      <Box key={alternativ.id} borderWidth="1" borderColor="border-subtle" borderRadius={'large'} padding="4">
        <VStack gap="3">
          <HStack justify={'center'} paddingBlock={'2 4'}>
            {produktBilde(alternativ) && <img src={produktBilde(alternativ)} width="180px" />}
          </HStack>
          <VStack>
            <Etikett size="small">
              <Link href={`https://finnhjelpemiddel.nav.no/${alternativ.hmsArtNr}`} target="_blank">
                {alternativ.articleName || alternativ.title}
              </Link>
            </Etikett>
            <Undertittel>{`Hmsnr: ${alternativ.hmsArtNr}`}</Undertittel>
            <Brødtekst>{alternativ.supplier.name}</Brødtekst>
          </VStack>

          <HGrid columns={'auto 1fr'} gap="2 2">
            {alternativ.wareHouseStock?.map((lagerstatus) => (
              <React.Fragment>
                <Etikett>{lagerstatus?.location}: </Etikett>
                <div>
                  <Tag variant="success" size="xsmall">
                    {lagerstatus?.available} stk på lager
                  </Tag>
                </div>
              </React.Fragment>
            ))}
          </HGrid>
          <div>
            <Undertittel>{`Oppdatert: ${formaterRelativTid(alternativ?.wareHouseStock?.[0]?.updated)}`}</Undertittel>
          </div>
          <div>
            <Button
              variant="tertiary"
              size="small"
              icon={<ClockDashedIcon />}
              loading={henterLagerstatus}
              onClick={async () => {
                await sjekkLagerstatusForProdukt(alternativ.hmsArtNr)
                onMutate()
              }}
            >
              Sjekk lagerstatus
            </Button>
          </div>
        </VStack>
      </Box>
      <HStack justify={'center'} paddingBlock="2 0">
        <Checkbox value={alternativ.hmsArtNr}>Bytt til denne</Checkbox>
      </HStack>
    </VStack>
  )
}
