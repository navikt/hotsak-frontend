import { useRef, useState } from 'react'

import { Box, Button, Heading, HStack, Modal, Tag, VStack } from '@navikt/ds-react'
import { Brødtekst, Etikett, Tekst, Undertittel } from '../../../felleskomponenter/typografi.tsx'

interface EndreHjelpemiddelModalProps {
  åpen: boolean
  onLukk(): void
}

/*

Eksperiment for å teste konseptet om integrasjons med Finn Gjenbruksprodukt
*/
export function EndreGjenbruksproduktModal(props: EndreHjelpemiddelModalProps) {
  const { åpen, onLukk } = props
  const [submitting] = useState(false)

  const ref = useRef<HTMLDialogElement>(null)

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
        <Box paddingBlock="0 4">
          <Tekst>Noe forklarende tekst om hva dette er for noe. Hvor kommer disse fra osv.</Tekst>
        </Box>
        <VStack gap="3">
          <Box borderWidth="1" borderColor="border-subtle" borderRadius={'large'} padding="4">
            <VStack>
              <Etikett size="small">177948: Gemino 20</Etikett>
              <Brødtekst>Gemino 20M</Brødtekst>
              <Brødtekst>Sunrise Medical</Brødtekst>
              <HStack gap="2">
                <Etikett>HMS Oslo: </Etikett>
                <div>
                  <Tag variant="success" size="xsmall">
                    14 stk på lager
                  </Tag>
                </div>
              </HStack>
              <Undertittel>Sist oppdatert: I dag kl 05:30</Undertittel>
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
          <Box borderWidth="1" borderColor="border-subtle" borderRadius={'large'} padding="4">
            <VStack>
              <Etikett size="small">177947: Gemino 20</Etikett>
              <Brødtekst>Gemino 20S</Brødtekst>
              <Brødtekst>Sunrise Medical</Brødtekst>
              <HStack gap="2">
                <Etikett>HMS Oslo: </Etikett>
                <div>
                  <Tag variant="success" size="xsmall">
                    2 stk på lager
                  </Tag>
                </div>
              </HStack>
              <Undertittel>Sist oppdatert: I dag kl 05:30</Undertittel>
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
