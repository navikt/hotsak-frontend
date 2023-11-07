import React, { useRef } from 'react'

import { Button, Modal } from '@navikt/ds-react'
import { Tekst } from '../../felleskomponenter/typografi'

interface OpprettOrdreModalProps {
  open: boolean
  onBekreft: () => void
  loading: boolean
  onClose: () => void
}

export const OpprettOrdreModal: React.FC<OpprettOrdreModalProps> = ({ open, onBekreft, loading, onClose }) => {
  const ref = useRef<HTMLDialogElement>(null)
  return (
    <Modal
      ref={ref}
      closeOnBackdropClick={false}
      open={open}
      onClose={() => {
        onClose()
      }}
      header={{ heading: 'Vil du godkjenne bestillingen?' }}
    >
      <Modal.Body>
        <Tekst>
          Når du godkjenner bestillingen blir det automatisk opprettet og klargjort en ordre i OEBS. Alle hjelpemidler
          og tilbehør i bestillingen vil legges inn som ordrelinjer. Merk at det kan gå noen minutter før ordren er
          klargjort. Du trenger ikke gjøre noe mer med saken.
        </Tekst>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          size="small"
          onClick={() => onBekreft()}
          data-cy="btn-ferdigstill-bestilling"
          disabled={loading}
          loading={loading}
        >
          Godkjenn
        </Button>
        <Button
          variant="secondary"
          size="small"
          onClick={() => {
            onClose()
          }}
          disabled={loading}
        >
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
