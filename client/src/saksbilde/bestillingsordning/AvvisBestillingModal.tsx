import React, { useState } from 'react'
import styled from 'styled-components'

import { Button, Heading, Radio, RadioGroup, Textarea } from '@navikt/ds-react'

import { ButtonContainer, DialogBoks } from '../../felleskomponenter/Dialogboks'
import { Tekst } from '../../felleskomponenter/typografi'
import type { AvvisBestilling } from '../../types/types.internal'

interface AvvisBestillingModalProps {
  open: boolean
  loading: boolean

  onBekreft(tilbakemelding: AvvisBestilling): void

  onClose(): void
}

export const AvvisBestillingModal: React.FC<AvvisBestillingModalProps> = ({ open, onBekreft, loading, onClose }) => {
  // Modal && Modal.setAppElement("#root")
  const [valgtArsak, setValgtArsak] = useState<string>('')
  const [begrunnelse, setBegrunnelse] = useState<string>('')
  const [error, setError] = useState('')

  return (
    <DialogBoks shouldCloseOnOverlayClick={false} open={open} onClose={onClose}>
      <DialogBoks.Content>
        <Heading level="1" size="medium" spacing>
          Vil du avvise bestillingen?
        </Heading>
        <Tekst>
          Bestillingen avvises i Hotsak. Bruker og formidler vil se oppdatert status på nav.no innen neste virkedag. Det
          er ikke behov for å gjøre noe videre med saken i Gosys.
        </Tekst>
        <AvvisBestillingRadioGroup
          legend="Velg årsak til at bestillingen avvises"
          error={valgtArsak === '' && error}
          value={valgtArsak}
          onChange={setValgtArsak}
        >
          <Tekst>Brukes kun internt av teamet som utvikler Hotsak, og vises ikke til bruker.</Tekst>
          {avvisÅrsaker.map((arsak, index) => (
            <Radio key={arsak} value={arsak} data-cy={`avvis-bestilling-arsak-${index}`}>
              {arsak}
            </Radio>
          ))}
        </AvvisBestillingRadioGroup>
        <Textarea
          label="Begrunnelse for å avvise bestillingen"
          description="Unngå personopplysninger. Begrunnelsen lagres som en del av sakshistorikken. Svarene kan også bli brukt i videreutvikling av løsningen."
          value={begrunnelse}
          onChange={(e) => setBegrunnelse(e.target.value)}
        />
        <ButtonContainer>
          <Button
            variant="primary"
            size="small"
            onClick={() => {
              if (valgtArsak !== '') {
                onBekreft({
                  valgtArsak,
                  begrunnelse,
                })
              } else {
                setError('Du må velge en årsak i listen over.')
              }
            }}
            data-cy="btn-overfor-soknad"
            disabled={loading}
            loading={loading}
          >
            Avvis bestillingen
          </Button>
          <Button variant="secondary" size="small" onClick={onClose} disabled={loading}>
            Avbryt
          </Button>
        </ButtonContainer>
      </DialogBoks.Content>
    </DialogBoks>
  )
}

const avvisÅrsaker: ReadonlyArray<string> = ['Duplikat av en annen bestilling', 'Annet']

const AvvisBestillingRadioGroup = styled(RadioGroup)`
  margin: var(--navds-spacing-4) 0;
`
