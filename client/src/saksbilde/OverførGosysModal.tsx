import React, { useState } from 'react'
import styled from 'styled-components'

import { Button, Checkbox, CheckboxGroup, Heading, Textarea } from '@navikt/ds-react'

import { Knappepanel } from '../felleskomponenter/Button'
import { DialogBoks } from '../felleskomponenter/Dialogboks'
import { Tekst } from '../felleskomponenter/typografi'
import type { OverforGosysTilbakemelding } from '../types/types.internal'

interface OverførGosysModalProps {
  open: boolean
  loading: boolean
  årsaker: ReadonlyArray<string>

  onBekreft(tilbakemelding: OverforGosysTilbakemelding): void

  onClose(): void
}

export const OverførGosysModal: React.FC<OverførGosysModalProps> = ({
  open,
  årsaker = ['Annet'],
  loading,
  onBekreft,
  onClose,
}) => {
  // Modal && Modal.setAppElement("#root")
  const [valgteArsaker, setValgteArsaker] = useState<string[]>([])
  const [begrunnelse, setBegrunnelse] = useState<string>('')
  const [error, setError] = useState('')
  const manglerArsak = !valgteArsaker.length
  const manglerBegrunnelse = valgteArsaker.includes('Annet') && begrunnelse.trim().length < 3

  return (
    <DialogBoks shouldCloseOnOverlayClick={false} open={open} onClose={onClose}>
      <DialogBoks.Content>
        <Heading level="1" size="medium" spacing>
          Overfør til Gosys
        </Heading>
        <Tekst>
          Hvis du overfører saken til Gosys, vil den dukke opp som en vanlig journalføringsoppgave. Journalføring og
          videre saksbehandling må gjøres manuelt i Gosys og Infotrygd. Merk at det kan ta noen minutter før saken
          dukker opp i Gosys.
        </Tekst>
        <OverforGosysArsakCheckboxGroup
          legend="Hva må til for at du skulle kunne behandlet denne saken i Hotsak?"
          error={(manglerArsak || manglerBegrunnelse) && error}
          value={valgteArsaker}
          onChange={setValgteArsaker}
        >
          <Tekst>Brukes kun internt av teamet som utvikler Hotsak, og vises ikke i Gosys.</Tekst>
          {årsaker.map((årsak, index) => (
            <Checkbox key={årsak} value={årsak} data-cy={`overfor-soknad-arsak-${index}`}>
              {årsak}
            </Checkbox>
          ))}
        </OverforGosysArsakCheckboxGroup>
        <Textarea
          label="Begrunnelse (valgfri)"
          description="Gi en kort forklaring for hvorfor du ikke kan behandle saken. Unngå personopplysninger."
          value={begrunnelse}
          onChange={(e) => setBegrunnelse(e.target.value)}
        />
        <Knappepanel>
          <Button
            variant="primary"
            size="small"
            onClick={() => {
              if (manglerArsak) {
                setError('Du må velge minst en årsak i listen over.')
              } else if (manglerBegrunnelse) {
                setError('Du må gi en begrunnelse når det er huket av for Annet.')
              } else {
                onBekreft({
                  valgteArsaker,
                  begrunnelse,
                })
              }
            }}
            data-cy="btn-overfor-soknad"
            disabled={loading}
            loading={loading}
          >
            Overfør til Gosys
          </Button>
          <Button variant="secondary" size="small" onClick={onClose} disabled={loading}>
            Avbryt
          </Button>
        </Knappepanel>
      </DialogBoks.Content>
    </DialogBoks>
  )
}

const OverforGosysArsakCheckboxGroup = styled(CheckboxGroup)`
  margin: var(--a-spacing-4) 0;
`
