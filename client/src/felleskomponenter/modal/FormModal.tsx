import { Button, Dialog, type DialogPopupProps } from '@navikt/ds-react'
import { type ReactNode, type SubmitEventHandler } from 'react'
import { useFormContext } from 'react-hook-form'

export interface FormModalProps {
  open?: boolean
  onClose(): void | Promise<void>
  heading: string
  submitButtonLabel: string
  resetButtonLabel?: string
  width?: DialogPopupProps['width']
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
    width = '500px',
    onSubmit,
    children,
  } = props
  const { formState } = useFormContext()
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()} size="small">
      <Dialog.Popup closeOnOutsideClick={false} width={width} aria-label={heading}>
        <Dialog.Header>
          <Dialog.Title>{heading}</Dialog.Title>
        </Dialog.Header>
        <form onSubmit={onSubmit}>
          <Dialog.Body>{children}</Dialog.Body>
          <Dialog.Footer>
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
          </Dialog.Footer>
        </form>
      </Dialog.Popup>
    </Dialog>
  )
}
