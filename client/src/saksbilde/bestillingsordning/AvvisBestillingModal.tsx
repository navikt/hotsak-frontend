import React, { useState } from 'react'
import styled from 'styled-components'

import { Button, Checkbox, CheckboxGroup, Heading, Loader, Textarea } from '@navikt/ds-react'

import { ButtonContainer, DialogBoks } from '../../felleskomponenter/Dialogboks'
import { Tekst } from '../../felleskomponenter/typografi'
import type { AvvisBestilling } from '../../types/types.internal'

interface AvvisBestillingModalProps {
  open: boolean
  loading: boolean

  onBekreft(tilbakemelding: AvvisBestilling): void
  onClose(): void
}

export const AvvisBestillingModal: React.VFC<AvvisBestillingModalProps> = ({ open, onBekreft, loading, onClose }) => {
  // Modal && Modal.setAppElement("#root")
  const [valgteArsaker, setValgteArsaker] = useState<string[]>([])
  const [begrunnelse, setBegrunnelse] = useState<string>('')
  const [error, setError] = useState('')

  return (
    <DialogBoks shouldCloseOnOverlayClick={false} open={open} onClose={onClose}>
      <DialogBoks.Content>
        <Heading level="1" size="medium" spacing>
          Vil du avvise bestillingen?
        </Heading>
        <Tekst>
          Bestillingen avvises i Hotsak. Bruker og formidler vil se oppdatert status på nav.no. Det er ikke behov for å
          gjøre noe videre med saken i Gosys.
        </Tekst>
        <AvvisBestillingCheckboxGroup
          legend="Velg årsak til at bestillingen avvises"
          error={!valgteArsaker.length && error}
          value={valgteArsaker}
          onChange={setValgteArsaker}
        >
          <Tekst>Brukes kun internt av teamet som utvikler Hotsak, og vises ikke til bruker.</Tekst>
          {avvisÅrsaker.map((arsak, index) => (
            <Checkbox key={arsak} value={arsak} data-cy={`avvis-bestilling-arsak-${index}`}>
              {arsak}
            </Checkbox>
          ))}
        </AvvisBestillingCheckboxGroup>
        <Textarea
          label="Begrunnelse (valgfri)"
          description="Gi en kort forklaring for hvorfor bestillingen avvises. Unngå personopplysninger."
          value={begrunnelse}
          onChange={(e) => setBegrunnelse(e.target.value)}
        />
        <ButtonContainer>
          <Button
            variant="primary"
            size="small"
            onClick={() => {
              if (valgteArsaker.length) {
                onBekreft({
                  valgteArsaker,
                  begrunnelse,
                })
              } else {
                setError('Du må velge minst en årsak i listen over.')
              }
            }}
            data-cy="btn-overfor-soknad"
            disabled={loading}
          >
            Avvis bestillingen
            {loading && <Loader size="small" />}
          </Button>
          <Button variant="secondary" size="small" onClick={onClose}>
            Avbryt
          </Button>
        </ButtonContainer>
      </DialogBoks.Content>
    </DialogBoks>
  )
}

const avvisÅrsaker: ReadonlyArray<string> = ['Duplikat av en annen bestilling', 'Annet']

const AvvisBestillingCheckboxGroup = styled(CheckboxGroup)`
  margin: var(--navds-spacing-4) 0;
`
