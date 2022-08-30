import React from 'react'

import { Button, Heading } from '@navikt/ds-react'

import { ButtonContainer, DialogBoks } from '../felleskomponenter/Dialogboks'
import { Tekst } from '../felleskomponenter/typografi'

interface OvertaSakModalProps {
  open: boolean
  onBekreft: () => void
  loading: boolean
  onClose: () => void
  saksbehandler: string
}

export const OvertaSakModal: React.FC<OvertaSakModalProps> = ({ open, saksbehandler, onBekreft, loading, onClose }) => {
  return (
    <DialogBoks
      shouldCloseOnOverlayClick={false}
      open={open}
      onClose={() => {
        onClose()
      }}
    >
      <DialogBoks.Content>
        <Heading level="1" size="medium" spacing>
          Vil du overta saken?
        </Heading>
        <Tekst>Denne saken er allerede tildelt {saksbehandler}, er du sikker på at du vil overta saken?</Tekst>
        <ButtonContainer>
          <Button
            variant="primary"
            size="small"
            onClick={() => onBekreft()}
            data-cy="btn-overta-sak"
            disabled={loading}
            loading={loading}
          >
            Overta saken
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() => {
              onClose()
            }}
            disabled={loading}
          >
            Avbryt
          </Button>
        </ButtonContainer>
      </DialogBoks.Content>
    </DialogBoks>
  )
}
