import { Button, Dialog, Select } from '@navikt/ds-react'
import { useState } from 'react'

import { stønadsklassifiseringData } from '../oppgave/stønadsklassifiseringData.ts'

interface EndreStønadsklassifiseringModalProps {
  open: boolean
  nåværendeKode: string
  onBekreft(kode: string): void
  onClose(): void
}

export function EndreStønadsklassifiseringModal({
  open,
  nåværendeKode,
  onBekreft,
  onClose,
}: EndreStønadsklassifiseringModalProps) {
  const [valgt, setValgt] = useState(nåværendeKode)

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setValgt(nåværendeKode)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Popup width="360px">
        <Dialog.Header>
          <Dialog.Title>Endre stønadsklassifisering</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Select label="Stønadsklassifisering" size="small" value={valgt} onChange={(e) => setValgt(e.target.value)}>
            {stønadsklassifiseringData.stk2.map((s) => (
              <option key={s.kode} value={s.kode}>
                {s.tekst}
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
