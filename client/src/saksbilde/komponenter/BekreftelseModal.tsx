import { Button, ButtonProps, Heading, Modal, type ModalProps } from '@navikt/ds-react'
import { ReactNode, useRef } from 'react'

export interface BekreftelseModalProps {
  avbrytButtonLabel?: string
  avbrytButtonVariant?: ButtonProps['variant']
  bekreftButtonLabel: string
  bekreftButtonVariant?: ButtonProps['variant']
  buttonSize?: ButtonProps['size']
  children?: ReactNode
  heading: string
  loading?: boolean
  open?: boolean
  reverserKnapperekkefølge?: boolean
  width?: ModalProps['width']

  onBekreft(): void
  onClose(): void
}

export function BekreftelseModal(props: BekreftelseModalProps) {
  const {
    avbrytButtonLabel = 'Avbryt',
    avbrytButtonVariant = 'secondary',
    bekreftButtonLabel,
    bekreftButtonVariant = 'primary',
    buttonSize = 'small',
    children,
    heading,
    loading,
    open,
    reverserKnapperekkefølge = false,
    width = '500px',

    onBekreft,
    onClose,
  } = props
  const ref = useRef<HTMLDialogElement>(null)

  const bekreftKnapp = (
    <Button variant={bekreftButtonVariant} size={buttonSize} onClick={onBekreft} disabled={loading} loading={loading}>
      {bekreftButtonLabel}
    </Button>
  )

  const avbrytKnapp = (
    <Button variant={avbrytButtonVariant} size={buttonSize} onClick={onClose} disabled={loading}>
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
          {reverserKnapperekkefølge ? avbrytKnapp : bekreftKnapp}
          {reverserKnapperekkefølge ? bekreftKnapp : avbrytKnapp}
        </>
      </Modal.Footer>
    </Modal>
  )
}
