import { Box, Heading, HGrid, Link, VStack } from '@navikt/ds-react'
import { Brødtekst, Etikett } from '../../../felleskomponenter/typografi'
import { Opplysninger } from '../Opplysninger'
import { Produkt } from '../../../types/types.internal'
import { Hjelpemiddel } from '../../../types/BehovsmeldingTypes'

export function OriginaltHjelpemiddel(props: OriginaltHjelpemiddelProps) {
  const { hjelpemiddel, grunndataProdukt } = props

  return (
    <>
      <Heading level="1" size="small">
        Produktet det er søkt om:
      </Heading>
      <Box.New background="sunken" borderRadius="large" padding="space-24">
        <HGrid columns="1fr 2fr" gap="space-16">
          <HGrid columns="auto 1fr" gap="space-12">
            <div>
              {grunndataProdukt && (
                <img
                  alt="Produktbilde"
                  src={grunndataProdukt.produktbildeUri}
                  style={{
                    width: '85px',
                    //maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                />
              )}
            </div>
            <VStack gap="space-4">
              <Etikett size="small">
                <Link href={`https://finnhjelpemiddel.nav.no/${hjelpemiddel.produkt.hmsArtNr}`} target="_blank">
                  {hjelpemiddel.produkt.artikkelnavn}
                </Link>
              </Etikett>
              <Brødtekst>{`Hmsnr: ${hjelpemiddel.produkt.hmsArtNr}`}</Brødtekst>
              {grunndataProdukt && <Brødtekst>{grunndataProdukt?.leverandør}</Brødtekst>}
            </VStack>
          </HGrid>
          <Opplysninger
            opplysninger={hjelpemiddel.opplysninger.filter(
              (opplysning) =>
                opplysning.ledetekst.nb.toLowerCase() !== 'bruksarena' &&
                opplysning.ledetekst.nb.toLowerCase() !== 'funksjon' &&
                opplysning.ledetekst.nb.toLowerCase() !== 'grunnen til behovet'
            )}
          />
        </HGrid>
      </Box.New>
    </>
  )
}

interface OriginaltHjelpemiddelProps {
  hjelpemiddel: Hjelpemiddel
  grunndataProdukt?: Produkt | undefined
}
