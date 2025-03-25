import { Button, ButtonProps, Heading, Modal, ModalProps } from '@navikt/ds-react'
import { ReactNode, useRef } from 'react'

export interface BekreftelseModalProps {
  heading: string
  loading?: boolean
  open?: boolean
  bekreftButtonLabel: string
  reverserKnapperekkefølge?: boolean
  bekreftButtonVariant?: ButtonProps['variant']
  avbrytButtonLabel?: string
  avbrytButtonVariant?: ButtonProps['variant']
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
    bekreftButtonLabel,
    reverserKnapperekkefølge = false,
    bekreftButtonVariant = 'primary',
    avbrytButtonLabel = 'Avbryt',
    avbrytButtonVariant = 'secondary',
    width = '500px',
    children,
    onBekreft,
    onClose,
  } = props
  const ref = useRef<HTMLDialogElement>(null)

  const BekreftKnapp = () => (
    <Button variant={bekreftButtonVariant} size="small" onClick={onBekreft} disabled={loading} loading={loading}>
      {bekreftButtonLabel}
    </Button>
  )

  const AvbrytKnapp = () => (
    <Button variant={avbrytButtonVariant} size="small" onClick={onClose} disabled={loading}>
      {avbrytButtonLabel}
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
