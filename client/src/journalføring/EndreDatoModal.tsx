import { Button, DatePicker, Dialog, useDatepicker } from '@navikt/ds-react'
import { useState } from 'react'

interface EndreDatoModalProps {
  open: boolean
  label: string
  defaultDate: Date
  onBekreft(dato: Date): void
  onClose(): void
}

export function EndreDatoModal({ open, label, defaultDate, onBekreft, onClose }: EndreDatoModalProps) {
  const [valgtDato, setValgtDato] = useState<Date | undefined>(defaultDate)

  const { datepickerProps, inputProps } = useDatepicker({
    defaultSelected: defaultDate,
    onDateChange: (dato) => setValgtDato(dato),
  })

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Popup width="360px">
        <Dialog.Header>
          <Dialog.Title>Endre {label.toLowerCase()}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <DatePicker {...datepickerProps}>
            <DatePicker.Input {...inputProps} label={label} size="small" />
          </DatePicker>
        </Dialog.Body>
        <Dialog.Footer>
          <Button
            variant="primary"
            size="small"
            type="button"
            disabled={!valgtDato}
            onClick={() => valgtDato && onBekreft(valgtDato)}
          >
            Bekreft
          </Button>
          <Button variant="secondary" size="small" type="button" onClick={onClose}>
            Avbryt
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  )
}
