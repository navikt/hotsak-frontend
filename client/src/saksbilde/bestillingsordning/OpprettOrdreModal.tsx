import React from 'react'

import { Button, Heading } from '@navikt/ds-react'

import { Knappepanel } from '../../felleskomponenter/Button'
import { DialogBoks } from '../../felleskomponenter/Dialogboks'
import { Tekst } from '../../felleskomponenter/typografi'

interface OpprettOrdreModalProps {
  open: boolean
  onBekreft: () => void
  loading: boolean
  onClose: () => void
}

export const OpprettOrdreModal: React.FC<OpprettOrdreModalProps> = ({ open, onBekreft, loading, onClose }) => {
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
          Vil du godkjenne bestillingen?
        </Heading>
        <Tekst>
          Når du godkjenner bestillingen blir det automatisk opprettet og klargjort en ordre i OEBS. Alle hjelpemidler
          og tilbehør i bestillingen vil legges inn som ordrelinjer. Merk at det kan gå noen minutter før ordren er
          klargjort. Du trenger ikke gjøre noe mer med saken.
        </Tekst>
        <Knappepanel>
          <Button
            variant="primary"
            size="small"
            onClick={() => onBekreft()}
            data-cy="btn-ferdigstill-bestilling"
            disabled={loading}
            loading={loading}
          >
            Godkjenn
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
        </Knappepanel>
      </DialogBoks.Content>
    </DialogBoks>
  )
}
