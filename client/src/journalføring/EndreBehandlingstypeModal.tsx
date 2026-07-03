import { Button, Dialog, Select } from '@navikt/ds-react'
import { useState } from 'react'

import { type SakstypeKode } from './journalføringTypes.ts'
import { stønadstype } from '../oppgave/stønadsklassifiseringData.ts'

interface EndreBehandlingstypeModalProps {
  open: boolean
  nåværendeKode: SakstypeKode
  onBekreft(kode: SakstypeKode): void
  onClose(): void
}

export function EndreBehandlingstypeModal({ open, nåværendeKode, onBekreft, onClose }: EndreBehandlingstypeModalProps) {
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
          <Dialog.Title>Endre behandlingstype</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Select
            label="Behandlingstype"
            size="small"
            value={valgt}
            onChange={(e) => setValgt(e.target.value as SakstypeKode)}
          >
            {(Object.entries(stønadstype) as [SakstypeKode, string][]).map(([kode, tekst]) => (
              <option key={kode} value={kode}>
                {tekst}
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
