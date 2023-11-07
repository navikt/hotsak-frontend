import React, { useRef } from 'react'

import { Button, Modal } from '@navikt/ds-react'
import { Tekst } from '../felleskomponenter/typografi'

interface OvertaSakModalProps {
  open: boolean
  onBekreft: () => void
  loading: boolean
  onClose: () => void
  saksbehandler: string
  type?: string
}

export const OvertaSakModal: React.FC<OvertaSakModalProps> = ({
  open,
  saksbehandler,
  onBekreft,
  loading,
  onClose,
  type = 'sak',
}) => {
  const ref = useRef<HTMLDialogElement>(null)
  return (
    <Modal
      ref={ref}
      closeOnBackdropClick={false}
      width="600px"
      open={open}
      onClose={() => {
        onClose()
      }}
      header={{ heading: `Vil du overta ${type}en?` }}
    >
      <Modal.Body>
        <Tekst>{`Denne ${type}en er allerede tildelt ${saksbehandler}, er du sikker på at du vil overta ${type}en?`}</Tekst>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          size="small"
          onClick={() => onBekreft()}
          data-cy={`btn-overta-${type}`}
          disabled={loading}
          loading={loading}
        >
          {`Overta ${type}en`}
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
