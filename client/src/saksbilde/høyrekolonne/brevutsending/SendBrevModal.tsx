import React, { useRef } from 'react'

import { Button, Modal } from '@navikt/ds-react'
import { Brødtekst } from '../../../felleskomponenter/typografi'

interface SendBrevModalProps {
  open: boolean
  onBekreft: () => void
  loading: boolean
  onClose: () => void
}

export const SendBrevModal: React.FC<SendBrevModalProps> = ({ open, onBekreft, loading, onClose }) => {
  const ref = useRef<HTMLDialogElement>(null)
  return (
    <Modal
      ref={ref}
      closeOnBackdropClick={false}
      width="500px"
      open={open}
      onClose={() => {
        onClose()
      }}
      header={{ heading: 'Vil du sende brevet?' }}
    >
      <Modal.Body>
        <Brødtekst>{`Brevet sendes til adressen til barnet, og saken settes på vent.`}</Brødtekst>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="tertiary"
          size="small"
          onClick={() => {
            onClose()
          }}
          disabled={loading}
        >
          Avbryt
        </Button>
        <Button variant="primary" size="small" onClick={() => onBekreft()} disabled={loading} loading={loading}>
          {`Send brev`}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
