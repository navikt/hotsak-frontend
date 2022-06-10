import React from 'react'

import { Button, Heading, Loader } from '@navikt/ds-react'

import { ButtonContainer, DialogBoks } from '../../felleskomponenter/Dialogboks'
import { Tekst } from '../../felleskomponenter/typografi'

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
          Vil du opprette ordre?
        </Heading>
        <Tekst>
          Ordren vil bli opprettet i ordreorganisator i OEBS, og du trenger ikke gjøre noe mer med saken. Alle
          hjelpemidler i bestillingen vil automatisk legges inn som ordrelinjer. Merk at det kan gå noen minutter før
          ordren er klagjort.
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
