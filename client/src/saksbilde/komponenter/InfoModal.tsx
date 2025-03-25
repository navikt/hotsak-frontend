import { Button, Heading, Modal, ModalProps } from '@navikt/ds-react'
import { ReactNode, useRef } from 'react'

export interface InfoModalProps {
  heading?: string
  loading?: boolean
  open: boolean
  width?: ModalProps['width']
  children: ReactNode
  onClose(): void | Promise<void>
}

export function InfoModal(props: InfoModalProps) {
  const { heading, open, width = '500px', children, onClose } = props
  const ref = useRef<HTMLDialogElement>(null)
  return (
    <Modal
      ref={ref}
      closeOnBackdropClick={true}
      width={width}
      open={open}
      onClose={onClose}
      size="small"
      aria-label={heading || ''}
    >
      {heading && (
        <Modal.Header>
          <Heading level="1" size="small">
            {heading}
          </Heading>
        </Modal.Header>
      )}
      {children && <Modal.Body>{children}</Modal.Body>}
      <Modal.Footer>
        <Button variant="primary" size="small" onClick={onClose}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
