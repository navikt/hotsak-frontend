import { Button, ButtonProps, Modal, ModalProps } from '@navikt/ds-react'
import { ReactNode, useRef } from 'react'

export interface BekreftelseModalProps {
  heading: string
  loading?: boolean
  open?: boolean
  buttonLabel: string
  buttonVariant?: ButtonProps['variant']
  width?: ModalProps['width']
  children?: ReactNode
  onBekreft(): any | Promise<any>
  onClose(): void | Promise<void>
}

export function BekreftelseModal(props: BekreftelseModalProps) {
  const {
    heading,
    loading,
    open,
    buttonLabel,
    buttonVariant = 'primary',
    width = '500px',
    children,
    onBekreft,
    onClose,
  } = props
  const ref = useRef<HTMLDialogElement>(null)
  return (
    <Modal ref={ref} closeOnBackdropClick={false} width={width} open={open} onClose={onClose} header={{ heading }}>
      {children && <Modal.Body>{children}</Modal.Body>}
      <Modal.Footer>
        <Button variant={buttonVariant} size="small" onClick={onBekreft} disabled={loading} loading={loading}>
          {buttonLabel}
        </Button>
        <Button variant="secondary" size="small" onClick={onClose} disabled={loading}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
