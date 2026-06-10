import { Button, Dialog, DialogPopupProps, type DialogProps } from '@navikt/ds-react'
import { useRef } from 'react'

export interface InfoModalProps extends DialogProps {
  heading?: string
  width?: DialogPopupProps['width']
  onClose?(): void | Promise<void>
}

export function InfoModal(props: InfoModalProps) {
  const { heading, width = '500px', onClose, onOpenChange, children, ...rest } = props
  const okKnappRef = useRef<HTMLButtonElement>(null)

  return (
    <Dialog
      onOpenChange={(nextOpen, event) => {
        if (onOpenChange) {
          onOpenChange(nextOpen, event)
        } else if (!nextOpen && onClose) {
          onClose()
        }
      }}
      onOpenChangeComplete={(open) => {
        if (open) {
          okKnappRef.current?.focus({ focusVisible: true } as FocusOptions & { focusVisible?: boolean })
        }
      }}
      {...rest}
    >
      <Dialog.Popup initialFocusTo={okKnappRef} closeOnOutsideClick={true} width={width}>
        {heading && (
          <Dialog.Header>
            <Dialog.Title>{heading}</Dialog.Title>
          </Dialog.Header>
        )}
        <Dialog.Body>{children}</Dialog.Body>
        <Dialog.Footer>
          <Button ref={okKnappRef} variant="primary" size="small" onClick={onClose}>
            Ok
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  )
}
