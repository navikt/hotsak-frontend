import { Button, Modal, ModalProps } from '@navikt/ds-react'
import { type ReactNode, type SubmitEventHandler, useRef } from 'react'
import { useFormContext } from 'react-hook-form'

export interface FormModalProps {
  open?: boolean
  onClose(): void | Promise<void>
  heading: string
  submitButtonLabel: string
  resetButtonLabel?: string
  width?: ModalProps['width']
  onSubmit?: SubmitEventHandler<HTMLFormElement>
  children: ReactNode
}

export function FormModal(props: FormModalProps) {
  const {
    open,
    onClose,
    heading,
    submitButtonLabel,
    resetButtonLabel = 'Avbryt',
    width = 500,
    onSubmit,
    children,
  } = props
  const ref = useRef<HTMLDialogElement>(null)
  const { formState } = useFormContext()
  return (
    <Modal
      ref={ref}
      open={open}
      onClose={onClose}
      closeOnBackdropClick={false}
      size="small"
      width={width}
      header={{ heading, size: 'small' }}
      aria-label={heading}
    >
      <form onSubmit={onSubmit}>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            variant="primary"
            size="small"
            disabled={formState.isSubmitting}
            loading={formState.isSubmitting}
          >
            {submitButtonLabel}
          </Button>
          <Button type="reset" variant="secondary" size="small" disabled={formState.isSubmitting} onClick={onClose}>
            {resetButtonLabel}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}
