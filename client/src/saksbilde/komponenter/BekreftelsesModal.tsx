import React, { useRef } from 'react'

import { Button, Modal } from '@navikt/ds-react'

interface BekreftelsesModalProps {
  heading: string
  open: boolean
  buttonVariant?:
    | 'primary'
    | 'primary-neutral'
    | 'secondary'
    | 'secondary-neutral'
    | 'tertiary'
    | 'tertiary-neutral'
    | 'danger'
  buttonLabel: string
  width?: 'medium' | 'small' | number | `${number}${string}`
  onBekreft: () => void
  loading: boolean
  onClose: () => void
  children?: React.ReactNode
}

export const BekreftelsesModal: React.FC<BekreftelsesModalProps> = ({
  open,
  onBekreft,
  loading,
  onClose,
  width = '500px',
  heading,
  buttonVariant = 'primary',
  buttonLabel,
  children,
}) => {
  const ref = useRef<HTMLDialogElement>(null)
  return (
    <Modal
      ref={ref}
      closeOnBackdropClick={false}
      width={width}
      open={open}
      onClose={() => {
        onClose()
      }}
      header={{ heading }}
    >
      {children && <Modal.Body>{children}</Modal.Body>}
      <Modal.Footer>
        <Button variant={buttonVariant} size="small" onClick={() => onBekreft()} disabled={loading} loading={loading}>
          {buttonLabel}
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
