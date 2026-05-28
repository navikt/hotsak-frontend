import { Button, ButtonProps, Dialog } from '@navikt/ds-react'
import { ReactNode, useEffect, useRef } from 'react'

export interface BekreftelsesDialogProps {
  heading: string
  loading?: boolean
  open?: boolean
  bekreftButtonLabel: string
  reverserKnapperekkefølge?: boolean
  bekreftButtonVariant?: ButtonProps['variant']
  avbrytButtonLabel?: string
  buttonSize?: ButtonProps['size']
  avbrytButtonVariant?: ButtonProps['variant']
  width?: string
  children?: ReactNode
  onBekreft(): void | Promise<void>
  onClose(): void | Promise<void>
}

export function BekreftelsesDialog(props: BekreftelsesDialogProps) {
  const {
    heading,
    loading,
    open,
    bekreftButtonLabel,
    reverserKnapperekkefølge = false,
    buttonSize = 'small',
    bekreftButtonVariant = 'primary',
    avbrytButtonLabel = 'Avbryt',
    avbrytButtonVariant = 'secondary',
    width = '500px',
    children,
    onBekreft,
    onClose,
  } = props

  const bekreftKnappRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const id = setTimeout(() => {
      console.log('BK', bekreftKnappRef.current)
      bekreftKnappRef.current?.focus()
    }, 0)
    console.log('Fokuserer bekreft-knapp i dialog', id)
    return () => clearTimeout(id)
  }, [open])

  const bekreftKnapp = (
    <Button
      variant={bekreftButtonVariant}
      ref={bekreftKnappRef}
      size={buttonSize}
      onClick={onBekreft}
      disabled={loading}
      loading={loading}
    >
      {bekreftButtonLabel}
    </Button>
  )

  const avbrytKnapp = (
    <Button variant={avbrytButtonVariant} size={buttonSize} onClick={onClose} disabled={loading}>
      {avbrytButtonLabel}
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <Dialog.Popup closeOnOutsideClick={false} width={width}>
        <Dialog.Header>
          <Dialog.Title>{heading}</Dialog.Title>
        </Dialog.Header>
        {children && <Dialog.Body>{children}</Dialog.Body>}
        <Dialog.Footer>
          {reverserKnapperekkefølge ? (
            avbrytKnapp
          ) : (
            <Button
              variant={bekreftButtonVariant}
              ref={bekreftKnappRef}
              size={buttonSize}
              onClick={onBekreft}
              disabled={loading}
              loading={loading}
            >
              Balalaika
            </Button>
          )}
          {reverserKnapperekkefølge ? bekreftKnapp : avbrytKnapp}
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  )
}
