import { Box, HGrid, VStack } from '@navikt/ds-react'
import { FinnHjelpemiddelLink } from '../../../../felleskomponenter/FinnHjelpemiddelLink'
import { Etikett, Tekst, Undertittel } from '../../../../felleskomponenter/typografi'
import { HjelpemiddelData } from '../useHjelpemiddel'

export function ProduktCard({ hjelpemiddel }: { hjelpemiddel: HjelpemiddelData }) {
  return (
    <Box
      borderWidth="1"
      borderColor="neutral-subtle"
      background="raised"
      borderRadius="large"
      marginBlock="space-28 space-0"
      padding="space-16"
      maxWidth="350px"
    >
      <VStack>
        <Etikett size="small" spacing>
          {hjelpemiddel.artikkelnavn}
        </Etikett>
        <HGrid columns={hjelpemiddel.kilde === 'FinnHjelpemiddel' ? '1fr 1fr' : '1fr'} gap="space-16">
          {hjelpemiddel.produktbildeUri && (
            <img
              alt="Produktbilde"
              src={hjelpemiddel.produktbildeUri}
              style={{
                width: '150px',
                objectFit: 'contain',
              }}
            />
          )}
          <VStack>
            {hjelpemiddel.kilde === 'FinnHjelpemiddel' ? (
              <FinnHjelpemiddelLink hmsnr={hjelpemiddel.hmsArtNr}>
                <Tekst>{`Hmsnr: ${hjelpemiddel.hmsArtNr}`}</Tekst>
              </FinnHjelpemiddelLink>
            ) : (
              <Tekst>{`Hmsnr: ${hjelpemiddel.hmsArtNr}`}</Tekst>
            )}

            <Undertittel>Kilde: {hjelpemiddel.kilde}</Undertittel>
            <Tekst>{hjelpemiddel.leverandør}</Tekst>
          </VStack>
        </HGrid>
      </VStack>
    </Box>
  )
}
