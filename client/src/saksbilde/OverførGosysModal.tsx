import { Button, Checkbox, CheckboxGroup, Heading, Loader, Textarea } from '@navikt/ds-react'

import { ButtonContainer, DialogBoks } from '../felleskomponenter/Dialogboks'
import { Tekst } from '../felleskomponenter/typografi'
import styled from 'styled-components/macro'
import { useState, VFC } from 'react'
import type { OverforGosysTilbakemelding } from '../types/types.internal'

interface OverførGosysModalProps {
  open: boolean
  loading: boolean

  onBekreft(tilbakemelding: OverforGosysTilbakemelding): void
  onClose(): void
}

export const OverførGosysModal: VFC<OverførGosysModalProps> = ({ open, onBekreft, loading, onClose }) => {
  // Modal && Modal.setAppElement("#root")
  const [valgteArsaker, setValgteArsaker] = useState<string[]>([])
  const [begrunnelse, setBegrunnelse] = useState<string>('')
  const [error, setError] = useState('')

  return (
    <DialogBoks shouldCloseOnOverlayClick={false} open={open} onClose={onClose}>
      <DialogBoks.Content>
        <Heading level="1" size="medium" spacing>
          Vil du overføre saken til Gosys?
        </Heading>
        <Tekst>
          Hvis saken overføres til Gosys, vil den dukke opp som en vanlig journalføringsoppgave. Journalføring og videre
          saksbehandling må gjøres manuelt i Gosys og Infotrygd. Merk at det kan ta noen minutter før saken dukker opp i
          Gosys
        </Tekst>
        <OverforGosysArsakCheckboxGroup
          legend="Velg årsak til at saken må overføres til Gosys"
          error={!valgteArsaker.length && error}
          value={valgteArsaker}
          onChange={setValgteArsaker}
        >
          {overforGosysArsaker.map((arsak, index) => (
            <Checkbox key={arsak} value={arsak} data-cy={`overfor-soknad-arsak-${index}`}>
              {arsak}
            </Checkbox>
          ))}
        </OverforGosysArsakCheckboxGroup>
        <Textarea
          label="Begrunnelse (valgfri)"
          description="Gi en kort forklaring for hvorfor du ikke kan behandle saken. Unngå personopplysninger."
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
          >
            Overfør saken
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

const overforGosysArsaker: ReadonlyArray<string> = [
  'Det må etterspørres eller legges til flere opplysninger i saken',
  'Saken kan ikke innvilges (avslag, delvis innvilgelse eller annullering)',
  'Saken skal ses på av en annen saksbehandler eller enhet',
  'Formidler har ikke fullført nødvendig godkjenningskurs',
  'Annet',
]

const OverforGosysArsakCheckboxGroup = styled(CheckboxGroup)`
  margin: var(--navds-spacing-4) 0;
`
