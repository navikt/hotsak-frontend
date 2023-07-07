import React from 'react'

import { Button, Heading, Modal } from '@navikt/ds-react'

import { Knappepanel } from '../../../felleskomponenter/Button'
import { DialogBoks } from '../../../felleskomponenter/Dialogboks'
import { Brødtekst } from '../../../felleskomponenter/typografi'

interface SendBrevModalProps {
  open: boolean
  onBekreft: () => void
  loading: boolean
  onClose: () => void
}

export const SendBrevModal: React.FC<SendBrevModalProps> = ({ open, onBekreft, loading, onClose }) => {
  return (
    <DialogBoks
      width="500px"
      shouldCloseOnOverlayClick={false}
      open={open}
      onClose={() => {
        onClose()
      }}
    >
      <Modal.Content>
        <Heading level="1" size="medium" spacing>
          {`Vil du sende brevet?`}
        </Heading>
        <Brødtekst>{`Brevet sendes til adressen til barnet, og saken settes på vent.`}</Brødtekst>
        <Knappepanel>
          <Button
            variant="tertiary"
            size="small"
            onClick={() => {
              onClose()
            }}
            disabled={loading}
          >
            Avbryt
          </Button>
          <Button variant="primary" size="small" onClick={() => onBekreft()} disabled={loading} loading={loading}>
            {`Send brev`}
          </Button>
        </Knappepanel>
      </Modal.Content>
    </DialogBoks>
  )
}
