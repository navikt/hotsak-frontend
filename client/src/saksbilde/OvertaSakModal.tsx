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
  type?: string
}

export const OvertaSakModal: React.FC<OvertaSakModalProps> = ({
  open,
  saksbehandler,
  onBekreft,
  loading,
  onClose,
  type = 'sak',
}) => {
  return (
    <DialogBoks
      width="600px"
      shouldCloseOnOverlayClick={false}
      open={open}
      onClose={() => {
        onClose()
      }}
    >
      <DialogBoks.Content>
        <Heading level="1" size="medium" spacing>
          {`Vil du overta ${type}en?`}
        </Heading>
        <Tekst>{`Denne ${type}en er allerede tildelt ${saksbehandler}, er du sikker på at du vil overta ${type}en?`}</Tekst>
        <ButtonContainer>
          <Button
            variant="primary"
            size="small"
            onClick={() => onBekreft()}
            data-cy={`btn-overta-${type}`}
            disabled={loading}
            loading={loading}
          >
            {`Overta ${type}en`}
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
