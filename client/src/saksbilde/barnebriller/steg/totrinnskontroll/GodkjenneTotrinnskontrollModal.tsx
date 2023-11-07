import React, { useRef } from 'react'

import { Button, Modal } from '@navikt/ds-react'
import { Brødtekst } from '../../../../felleskomponenter/typografi'

interface GodkjenneTotrinnskontrollModalProps {
  open: boolean
  onBekreft: () => void
  loading: boolean
  onClose: () => void
}

export const GodkjenneTotrinnskontrollModal: React.FC<GodkjenneTotrinnskontrollModalProps> = ({
  open,
  onBekreft,
  loading,
  onClose,
}) => {
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
      header={{ heading: 'Vil du godkjenne vedtaket' }}
    >
      <Modal.Body>
        <Brødtekst>{`Vedtaket blir fattet og brevet sendes til adressen til barnet.`}</Brødtekst>
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
          {`Godkjenn vedtak`}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
