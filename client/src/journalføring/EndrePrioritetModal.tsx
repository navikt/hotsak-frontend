import { Button, Dialog, Select } from '@navikt/ds-react'
import { useState } from 'react'

import { Oppgaveprioritet, OppgaveprioritetLabel } from '../oppgave/oppgaveTypes.ts'

interface EndrePrioritetModalProps {
  open: boolean
  nåværendePrioritet: Oppgaveprioritet
  onBekreft(prioritet: Oppgaveprioritet): void
  onClose(): void
}

export function EndrePrioritetModal({ open, nåværendePrioritet, onBekreft, onClose }: EndrePrioritetModalProps) {
  const [valgt, setValgt] = useState(nåværendePrioritet)

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setValgt(nåværendePrioritet)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Popup width="360px">
        <Dialog.Header>
          <Dialog.Title>Endre prioritet</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Select
            label="Prioritet"
            size="small"
            value={valgt}
            onChange={(e) => setValgt(e.target.value as Oppgaveprioritet)}
          >
            {Object.values(Oppgaveprioritet).map((p) => (
              <option key={p} value={p}>
                {OppgaveprioritetLabel[p]}
              </option>
            ))}
          </Select>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="primary" size="small" type="button" onClick={() => onBekreft(valgt)}>
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
