import { useRef, useState } from 'react'

import { Button, Heading, Modal, VStack } from '@navikt/ds-react'
import { AlternativeProduct } from '../../../generated/finnAlternativprodukt.ts'
import { AlternativtProduktCard } from './AlternativtProduktCard.tsx'

interface EndreHjelpemiddelModalProps {
  åpen: boolean
  alternativer: AlternativeProduct[]
  onLukk(): void
}

/*

Eksperiment for å teste konseptet om integrasjons med Finn Gjenbruksprodukt
*/
export function AlternativProdukterModal(props: EndreHjelpemiddelModalProps) {
  const { åpen, onLukk, alternativer } = props
  const [submitting] = useState(false)

  const ref = useRef<HTMLDialogElement>(null)

  //console.log(`AlternativProduktertModal: gjeldendeEnhetsnavn: ${gjeldendeEnhetsnavn}`)

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
          {alternativer.map((alternativ) => (
            <AlternativtProduktCard key={alternativ.id} alternativtProdukt={alternativ} />
          ))}
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
