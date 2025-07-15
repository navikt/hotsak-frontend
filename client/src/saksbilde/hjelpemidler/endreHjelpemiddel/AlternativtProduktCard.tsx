import { ClockDashedIcon } from '@navikt/aksel-icons'
import { Bleed, Box, Button, Checkbox, HGrid, HStack, Link, Skeleton, Tag, VStack } from '@navikt/ds-react'
import React from 'react'
import styled from 'styled-components'

import { Brødtekst, Etikett, Undertittel } from '../../../felleskomponenter/typografi'
import type { AlternativeProduct } from '../useAlternativeProdukter.ts'
import { formaterRelativTid } from '../../../utils/dato'
import { useLagerstatus } from '../useLagerstatus.ts'

interface AlternativProduktCardProps {
  alternativ: AlternativeProduct
  skjulLagerstatusKnapp: boolean
  lagerstatusLoading: boolean
  onMutate: () => void
  endretProdukt: string[]
}

export function AlternativtProduktCard({
  alternativ,
  onMutate,
  endretProdukt,
  skjulLagerstatusKnapp,
  lagerstatusLoading,
}: AlternativProduktCardProps) {
  // TODO flytt denne til egen hook for å unngå kollisjoner
  const { sjekkLagerstatusForProdukt, loading: henterLagerstatus } = useLagerstatus()

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
        key={alternativ.id}
        borderWidth="1"
        borderColor="border-subtle"
        borderRadius={'large'}
        padding="4"
        selected={endretProdukt.includes(alternativ.hmsArtNr)}
      >
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
          <HGrid columns={'auto 1fr'} gap="2 2" align="center">
            {alternativ.wareHouseStock?.map((lagerstatus) => (
              <React.Fragment key={lagerstatus?.location}>
                <Etikett>{lagerstatus?.location}: </Etikett>
                {lagerstatusLoading ? (
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
            <Undertittel>{`Oppdatert: ${formaterRelativTid(alternativ?.wareHouseStock?.[0]?.updated)}`}</Undertittel>
          </div>
          {!skjulLagerstatusKnapp && !lagerstatusLoading && (
            <Bleed marginInline="3">
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
            </Bleed>
          )}
        </VStack>
      </ProduktCard>
      <HStack justify={'center'} paddingBlock="2 0">
        <Checkbox value={alternativ.hmsArtNr}>Bytt til denne</Checkbox>
      </HStack>
    </VStack>
  )
}

const ProduktCard = styled(Box)<{ selected?: boolean }>`
  border: ${({ selected }) => selected && '4px solid var(--a-border-selected)'};
  margin: ${({ selected }) => selected && '-3px'};
`
