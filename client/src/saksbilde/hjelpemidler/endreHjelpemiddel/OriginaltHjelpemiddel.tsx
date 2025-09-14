import { Box, Heading, HGrid, Link, VStack } from '@navikt/ds-react'
import { Brødtekst, Etikett } from '../../../felleskomponenter/typografi'
import { Hjelpemiddel } from '../../../types/BehovsmeldingTypes'
import { Produkt } from '../../../types/types.internal'
import { storForbokstavIOrd } from '../../../utils/formater'

export function OriginaltHjelpemiddel(props: OriginaltHjelpemiddelProps) {
  const { hjelpemiddel, grunndataProdukt } = props

  const opplysninger = hjelpemiddel.opplysninger.filter(
    (opplysning) =>
      opplysning.ledetekst.nb.toLowerCase() !== 'bruksarena' &&
      opplysning.ledetekst.nb.toLowerCase() !== 'funksjon' &&
      opplysning.ledetekst.nb.toLowerCase() !== 'grunnen til behovet'
  )

  return (
    <>
      <Box.New borderRadius="large" padding="space-24">
        <HGrid columns="1fr 1fr" gap="space-16">
          <div>
            <Heading level="2" size="xsmall" spacing>
              Produktet det er søkt om:
            </Heading>
            <HGrid columns="auto 1fr" gap="space-20">
              <div>
                {grunndataProdukt && (
                  <img
                    alt="Produktbilde"
                    src={grunndataProdukt.produktbildeUri}
                    style={{
                      width: '160px',
                      //maxWidth: '100%',
                      objectFit: 'contain',
                      borderRadius: 'var(--ax-radius-8)',
                    }}
                  />
                )}
              </div>
              <VStack gap="space-4">
                <Etikett size="small">{hjelpemiddel.produkt.artikkelnavn}</Etikett>
                <Link href={`https://finnhjelpemiddel.nav.no/${hjelpemiddel.produkt.hmsArtNr}`} target="_blank">
                  <Brødtekst>{`Hmsnr: ${hjelpemiddel.produkt.hmsArtNr}`}</Brødtekst>
                </Link>
                {grunndataProdukt && <Brødtekst>{grunndataProdukt?.leverandør}</Brødtekst>}
              </VStack>
            </HGrid>
          </div>

          <VStack gap="space-8">
            <Heading level="2" size="xsmall">
              Brukers behov:
            </Heading>
            {opplysninger.map((opplysning) => {
              return (
                <Box key={opplysning.ledetekst.nb}>
                  <Etikett>{`${storForbokstavIOrd(opplysning.ledetekst.nb)}`}</Etikett>
                  {opplysning.innhold.length === 1 ? (
                    <Brødtekst>
                      {opplysning.innhold[0].forhåndsdefinertTekst
                        ? opplysning.innhold[0].forhåndsdefinertTekst.nb
                        : opplysning.innhold[0].fritekst}
                    </Brødtekst>
                  ) : (
                    <ul key={opplysning.ledetekst.nb} style={{ margin: '0' }}>
                      {opplysning.innhold.map((element, idx) => (
                        <li key={idx}>
                          <Brødtekst>
                            {element.forhåndsdefinertTekst ? element.forhåndsdefinertTekst.nb : element.fritekst}
                          </Brødtekst>
                        </li>
                      ))}
                    </ul>
                  )}
                </Box>
              )
            })}
          </VStack>
        </HGrid>
      </Box.New>
    </>
  )
}

interface OriginaltHjelpemiddelProps {
  hjelpemiddel: Hjelpemiddel
  grunndataProdukt?: Produkt | undefined
}
