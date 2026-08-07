import { Button, Dialog, Radio, RadioGroup, Textarea } from '@navikt/ds-react'
import { useState } from 'react'

import classes from './AvvisBestillingModal.module.css'

import { Tekst } from '../../felleskomponenter/typografi'
import type { AvvisBestilling } from '../../types/types.internal'

interface AvvisBestillingModalProps {
  open: boolean
  loading: boolean
  onBekreft(tilbakemelding: AvvisBestilling): void
  onClose(): void
}

export function AvvisBestillingModal({ open, onBekreft, loading, onClose }: AvvisBestillingModalProps) {
  const [valgtÅrsak, setValgtÅrsak] = useState<string>('')
  const [begrunnelse, setBegrunnelse] = useState<string>('')
  const [error, setError] = useState('')

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <Dialog.Popup closeOnOutsideClick={false}>
        <Dialog.Header>
          <Dialog.Title>Vil du avvise bestillingen?</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Tekst>
            Bestillingen avvises i Hotsak. Bruker og formidler vil se oppdatert status på nav.no innen neste virkedag.
            Det er ikke behov for å gjøre noe videre med saken i Gosys.
          </Tekst>
          <RadioGroup
            className={classes.avvisBestillingRadioGroup}
            legend="Velg årsak til at bestillingen avvises"
            error={valgtÅrsak === '' && error}
            value={valgtÅrsak}
            size="small"
            onChange={setValgtÅrsak}
          >
            <Tekst>Brukes kun internt av teamet som utvikler Hotsak, og vises ikke til bruker.</Tekst>
            {avvisÅrsaker.map((årsak, index) => (
              <Radio key={årsak} value={årsak} data-cy={`avvis-bestilling-arsak-${index}`}>
                {årsak}
              </Radio>
            ))}
          </RadioGroup>
          <Textarea
            label="Begrunnelse for å avvise bestillingen"
            description="Unngå personopplysninger. Begrunnelsen lagres som en del av sakshistorikken. Svarene kan også bli brukt i videreutvikling av løsningen."
            value={begrunnelse}
            size="small"
            onChange={(e) => setBegrunnelse(e.target.value)}
          />
        </Dialog.Body>
        <Dialog.Footer>
          <Button
            variant="primary"
            size="small"
            onClick={() => {
              if (valgtÅrsak !== '') {
                onBekreft({
                  valgtArsak: valgtÅrsak,
                  begrunnelse,
                })
              } else {
                setError('Du må velge en årsak i listen over.')
              }
            }}
            disabled={loading}
            loading={loading}
          >
            Avvis bestillingen
          </Button>
          <Button variant="secondary" size="small" onClick={onClose} disabled={loading}>
            Avbryt
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  )
}

const avvisÅrsaker: ReadonlyArray<string> = ['Duplikat av en annen bestilling', 'Annet']
