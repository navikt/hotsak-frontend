import { Button, Modal, Radio, RadioGroup, Textarea } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import styled from 'styled-components'

import { Tekst } from '../../felleskomponenter/typografi'
import type { AvvisBestilling } from '../../types/types.internal'

interface AvvisBestillingModalProps {
  open: boolean
  loading: boolean
  onBekreft(tilbakemelding: AvvisBestilling): void
  onClose(): void
}

export function AvvisBestillingModal({ open, onBekreft, loading, onClose }: AvvisBestillingModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const [valgtÅrsak, setValgtÅrsak] = useState<string>('')
  const [begrunnelse, setBegrunnelse] = useState<string>('')
  const [error, setError] = useState('')

  return (
    <Modal
      ref={ref}
      closeOnBackdropClick={false}
      open={open}
      onClose={onClose}
      header={{ heading: 'Vil du avvise bestillingen?' }}
    >
      <Modal.Body>
        <Tekst>
          Bestillingen avvises i Hotsak. Bruker og formidler vil se oppdatert status på nav.no innen neste virkedag. Det
          er ikke behov for å gjøre noe videre med saken i Gosys.
        </Tekst>
        <AvvisBestillingRadioGroup
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
        </AvvisBestillingRadioGroup>
        <Textarea
          label="Begrunnelse for å avvise bestillingen"
          description="Unngå personopplysninger. Begrunnelsen lagres som en del av sakshistorikken. Svarene kan også bli brukt i videreutvikling av løsningen."
          value={begrunnelse}
          size="small"
          onChange={(e) => setBegrunnelse(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
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
      </Modal.Footer>
    </Modal>
  )
}

const avvisÅrsaker: ReadonlyArray<string> = ['Duplikat av en annen bestilling', 'Annet']

const AvvisBestillingRadioGroup = styled(RadioGroup)`
  margin: var(--a-spacing-4) 0;
`
