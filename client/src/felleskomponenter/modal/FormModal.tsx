import { Button, Heading, Modal, ModalProps } from '@navikt/ds-react'
import { ReactNode, useRef } from 'react'
import { useFormStatus } from 'react-dom'

export interface FormModalProps {
  heading: string
  open?: boolean
  submitButtonLabel: string
  avbrytButtonLabel?: string
  width?: ModalProps['width']
  children?: ReactNode
  action: any
  onClose(): void | Promise<void>
}

export function FormModal(props: FormModalProps) {
  const {
    heading,
    open,
    submitButtonLabel,
    avbrytButtonLabel = 'Avbryt',
    width = '500px',
    children,
    action,
    onClose,
  } = props
  const ref = useRef<HTMLDialogElement>(null)
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
      <form action={action}>
        {children && <Modal.Body>{children}</Modal.Body>}
        <FormModalFooter
          submitButtonLabel={submitButtonLabel}
          avbrytButtonLabel={avbrytButtonLabel}
          onClose={onClose}
        />
      </form>
    </Modal>
  )
}

function FormModalFooter({
  submitButtonLabel,
  avbrytButtonLabel,
  onClose,
}: {
  submitButtonLabel: string
  avbrytButtonLabel: string
  onClose(): void | Promise<void>
}) {
  const { pending } = useFormStatus()
  return (
    <Modal.Footer>
      <Button type="submit" variant="primary" size="small" disabled={pending} loading={pending}>
        {submitButtonLabel}
      </Button>
      <Button type="button" variant="secondary" size="small" disabled={pending} onClick={onClose}>
        {avbrytButtonLabel}
      </Button>
    </Modal.Footer>
  )
}
