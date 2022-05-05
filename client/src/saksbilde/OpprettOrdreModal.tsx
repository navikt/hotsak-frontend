import React from 'react'

import { Button, Heading, Loader } from '@navikt/ds-react'

import { ButtonContainer, DialogBoks } from '../felleskomponenter/Dialogboks'
import { Tekst } from '../felleskomponenter/typografi'

interface OpprettOrdreModalProps {
  open: boolean
  onBekreft: () => void
  loading: boolean
  onClose: () => void
}

export const OpprettOrdreModal: React.VFC<OpprettOrdreModalProps> = ({ open, onBekreft, loading, onClose }) => {
  return (
    <DialogBoks
      shouldCloseOnOverlayClick={false}
      open={open}
      onClose={() => {
        onClose()
      }}
    >
      <DialogBoks.Content>
        <Heading level="1" size="medium" spacing={true}>
          Vil du ferdigstille bestillingen
        </Heading>
        <Tekst>
          Ved å ferdigstille bestillingen vil det bli opprettett en ordre i ordreorganisator i OEBS. Alle hjelpemidler i
          bestillingen vil automatisk legges inn som ordrelinjer.
        </Tekst>
        <ButtonContainer>
          <Button variant="primary" size="small" onClick={() => onBekreft()} data-cy="btn-ferdigstill-bestilling">
            Opprett ordre
            {loading && <Loader size="small" />}
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() => {
              onClose()
            }}
          >
            Avbryt
          </Button>
        </ButtonContainer>
      </DialogBoks.Content>
    </DialogBoks>
  )
}
