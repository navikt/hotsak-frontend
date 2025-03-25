import { Button, ButtonProps, Heading, Modal, ModalProps } from '@navikt/ds-react'
import { ReactNode, useRef } from 'react'

export interface BekreftelseModalProps {
  heading: string
  loading?: boolean
  open?: boolean
  buttonLabel: string
  reverserKnapperekkefølge?: boolean
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
    reverserKnapperekkefølge = false,
    buttonVariant = 'primary',
    width = '500px',
    children,
    onBekreft,
    onClose,
  } = props
  const ref = useRef<HTMLDialogElement>(null)

  const BekreftKnapp = () => (
    <Button variant={buttonVariant} size="small" onClick={onBekreft} disabled={loading} loading={loading}>
      {buttonLabel}
    </Button>
  )

  const AvbrytKnapp = () => (
    <Button variant="secondary" size="small" onClick={onClose} disabled={loading}>
      Avbryt
    </Button>
  )

  return (
    <Modal
      ref={ref}
      closeOnBackdropClick={false}
      width={width}
      open={open}
      onClose={onClose}
      size="small"
      aria-label={heading}
    >
      <Modal.Header>
        <Heading level="1" size="small">
          {heading}
        </Heading>
      </Modal.Header>
      {children && <Modal.Body>{children}</Modal.Body>}
      <Modal.Footer>
        <>
          {reverserKnapperekkefølge ? <AvbrytKnapp /> : <BekreftKnapp />}
          {reverserKnapperekkefølge ? <BekreftKnapp /> : <AvbrytKnapp />}
        </>
      </Modal.Footer>
    </Modal>
  )
}
