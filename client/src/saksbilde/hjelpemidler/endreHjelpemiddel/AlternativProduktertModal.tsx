import { useRef, useState } from 'react'

import { Box, Button, Heading, HStack, Modal, Tag, VStack } from '@navikt/ds-react'
import { Brødtekst, Etikett, Undertittel } from '../../../felleskomponenter/typografi.tsx'
import { AlternativeProduct } from '../../../generated/finnAlternativprodukt.ts'
import { formaterTidsstempelLesevennlig } from '../../../utils/dato.ts'
import { useTilgangContext } from '../../../tilgang/useTilgang.ts'

interface EndreHjelpemiddelModalProps {
  åpen: boolean
  alternativer: AlternativeProduct[]
  onLukk(): void
}

/*

Eksperiment for å teste konseptet om integrasjons med Finn Gjenbruksprodukt
*/
export function AlternativProduktertModal(props: EndreHjelpemiddelModalProps) {
  const { åpen, onLukk, alternativer } = props
  const [submitting] = useState(false)
  const { innloggetAnsatt } = useTilgangContext()

  const ref = useRef<HTMLDialogElement>(null)
  const gjeldendeEnhetsnavn = innloggetAnsatt.gjeldendeEnhet.navn.toLowerCase().replace('nav hjelpemiddelsentral ', '')

  console.log(`AlternativProduktertModal: gjeldendeEnhetsnavn: ${gjeldendeEnhetsnavn}`)

  // TODO: Finn en måte å matche hvilken sentral vi skal vise lager for. Vi trenger enhetsnummer i wareHouseStock
  // og bilder

  return (
    <Modal
      ref={ref}
      closeOnBackdropClick={false}
      width="600px"
      open={åpen}
      onClose={onLukk}
      size="small"
      aria-label={'Endre hjelpemiddel'}
    >
      <Modal.Header>
        <Heading level="1" size="small">
          Alternativer
        </Heading>
      </Modal.Header>
      <Modal.Body>
        <VStack gap="3">
          {alternativer.map((alternativ) => {
            const lagerstatusPåGjeldendeEnhet =
              alternativ.wareHouseStock?.find((stock) =>
                stock?.location?.toLocaleLowerCase().includes(gjeldendeEnhetsnavn)
              ) || alternativ.wareHouseStock?.[0]

            return (
              <Box borderWidth="1" borderColor="border-subtle" borderRadius={'large'} padding="4">
                <VStack>
                  <HStack gap="2" paddingBlock={'0 4'}>
                    <Tag variant={alternativ.hasAgreement ? 'success' : 'warning'} size="xsmall">
                      {alternativ.hasAgreement ? 'På avtale' : 'Ikke på avtale'}
                    </Tag>
                    {alternativ.agreements && alternativ.agreements.length > 0 && (
                      <Tag variant="success" size="xsmall">
                        {alternativ.agreements.length > 1
                          ? 'Flere delkontrakter'
                          : `Rangering ${alternativ.agreements[0]?.rank}`}
                      </Tag>
                    )}
                  </HStack>
                  <Etikett size="small">
                    {alternativ.hmsArtNr}: {alternativ.title}
                  </Etikett>
                  <Brødtekst>{alternativ.supplier.name}</Brødtekst>
                  <HStack gap="2">
                    <Etikett>{lagerstatusPåGjeldendeEnhet?.location}</Etikett>
                    <div>
                      <Tag variant="success" size="xsmall">
                        {lagerstatusPåGjeldendeEnhet?.available} stk på lager
                      </Tag>
                    </div>
                  </HStack>
                  <Undertittel> {formaterTidsstempelLesevennlig(lagerstatusPåGjeldendeEnhet?.updated)}</Undertittel>
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
          })}
        </VStack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          size="small"
          loading={submitting}
          onClick={async () => {
            onLukk()
          }}
        >
          Lagre endring
        </Button>
        <Button variant="tertiary" size="small" onClick={() => onLukk()}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
