import { Box, HGrid, VStack } from '@navikt/ds-react'
import { FinnHjelpemiddelLink } from '../../../../felleskomponenter/FinnHjelpemiddelLink'
import { Brødtekst, Etikett, Undertittel } from '../../../../felleskomponenter/typografi'
import { HjelpemiddelData } from '../useHjelpemiddel'

export function ProduktCard({ hjelpemiddel }: { hjelpemiddel: HjelpemiddelData }) {
  return (
    <Box.New
      borderWidth="1"
      borderColor="neutral-subtle"
      background="raised"
      borderRadius="large"
      marginBlock="space-28 0"
      padding="4"
      maxWidth="350px"
    >
      <VStack>
        <Etikett size="small" spacing>
          {hjelpemiddel.navn}
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
              <FinnHjelpemiddelLink hmsnr={hjelpemiddel.hmsnr}>
                <Brødtekst>{`Hmsnr: ${hjelpemiddel.hmsnr}`}</Brødtekst>
              </FinnHjelpemiddelLink>
            ) : (
              <Brødtekst>{`Hmsnr: ${hjelpemiddel.hmsnr}`}</Brødtekst>
            )}

            <Undertittel>Kilde: {hjelpemiddel.kilde}</Undertittel>
            <Brødtekst>{hjelpemiddel.leverandør}</Brødtekst>
          </VStack>
        </HGrid>
      </VStack>
    </Box.New>
  )
}
