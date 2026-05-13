import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { Box, Button, Heading, HGrid, VStack } from '@navikt/ds-react'
import { useRef, useState } from 'react'

import classes from './OriginaltHjelpemiddel.module.css'
import { FinnHjelpemiddelLink } from '../../../felleskomponenter/FinnHjelpemiddelLink'
import { Etikett, Tekst } from '../../../felleskomponenter/typografi'
import { Opplysning } from '../../../types/BehovsmeldingTypes'
import { Produkt } from '../../../types/types.internal'
import { storForbokstavIOrd } from '../../../utils/formater'
import { useIsClamped } from '../../../utils/useIsClamped'
import { Produktbilde } from '../../../felleskomponenter/bilde/Produktbilde'

export function OriginaltHjelpemiddel(props: OriginaltHjelpemiddelProps) {
  const { hmsnr, navn, opplysninger = [], grunndataProdukt } = props
  const [visAlt, setVisAlt] = useState(false)
  const opplysningerRef = useRef<HTMLDivElement>(null)
  const opplysningerTekst = relevanteOpplysningerTekst(opplysninger)
  const isClamped = useIsClamped(opplysningerTekst, opplysningerRef)

  const relevanteOpplysninger = (opplysninger ?? []).filter(
    (opplysning) =>
      opplysning.ledetekst.nb.toLowerCase() !== 'bruksarena' &&
      opplysning.ledetekst.nb.toLowerCase() !== 'funksjon' &&
      opplysning.ledetekst.nb.toLowerCase() !== 'grunnen til behovet'
  )

  return (
    <>
      <Box borderRadius="8">
        <HGrid columns="1fr 1fr" gap="space-16">
          <div>
            <Heading level="2" size="xsmall" spacing>
              Produktet det er søkt om:
            </Heading>
            <HGrid columns="auto 1fr" gap="space-20">
              {grunndataProdukt && <Produktbilde src={grunndataProdukt.produktbildeUri} alt={navn} size="small" />}
              <VStack gap="space-4">
                <Etikett size="small">{navn}</Etikett>
                <FinnHjelpemiddelLink hmsnr={hmsnr}>
                  <Tekst>{`Hmsnr: ${hmsnr}`}</Tekst>
                </FinnHjelpemiddelLink>
                {grunndataProdukt && <Tekst>{grunndataProdukt?.leverandør}</Tekst>}
              </VStack>
            </HGrid>
          </div>

          {opplysninger.length > 0 && (
            <VStack gap="space-8">
              <Heading level="2" size="xsmall">
                Brukers behov:
              </Heading>
              <div ref={opplysningerRef} className={visAlt ? undefined : classes.truncated}>
                {relevanteOpplysninger.map((opplysning) => {
                  return (
                    <Box key={opplysning.ledetekst.nb}>
                      <Etikett>{`${storForbokstavIOrd(opplysning.ledetekst.nb)}`}</Etikett>
                      {opplysning.innhold.length === 1 ? (
                        <Tekst>
                          {opplysning.innhold[0].forhåndsdefinertTekst
                            ? opplysning.innhold[0].forhåndsdefinertTekst.nb
                            : opplysning.innhold[0].fritekst}
                        </Tekst>
                      ) : (
                        <ul key={opplysning.ledetekst.nb} className={classes.opplysningListe}>
                          {opplysning.innhold.map((element, idx) => (
                            <li key={idx}>
                              <Tekst>
                                {element.forhåndsdefinertTekst ? element.forhåndsdefinertTekst.nb : element.fritekst}
                              </Tekst>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Box>
                  )
                })}
              </div>
              {isClamped && !visAlt && (
                <div>
                  <Button
                    variant="tertiary"
                    size="small"
                    icon={<ChevronDownIcon />}
                    iconPosition="right"
                    onClick={() => setVisAlt(true)}
                  >
                    Vis mer
                  </Button>
                </div>
              )}
              {visAlt && (
                <div>
                  <Button
                    variant="tertiary"
                    size="small"
                    icon={<ChevronUpIcon />}
                    iconPosition="right"
                    onClick={() => setVisAlt(false)}
                  >
                    Vis mindre
                  </Button>
                </div>
              )}
            </VStack>
          )}
        </HGrid>
      </Box>
    </>
  )
}

interface OriginaltHjelpemiddelProps {
  navn: string
  hmsnr: string
  opplysninger?: Opplysning[]
  grunndataProdukt?: Produkt | undefined
}

function relevanteOpplysningerTekst(opplysninger: Opplysning[]): string {
  return opplysninger
    .map((o) => o.innhold.map((i) => (i.forhåndsdefinertTekst ? i.forhåndsdefinertTekst.nb : i.fritekst)).join(' '))
    .join(' ')
}
