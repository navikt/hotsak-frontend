import { ReactElement } from 'react'

import { Button, Heading, Modal } from '@navikt/ds-react'

import { Knappepanel } from '../../felleskomponenter/Button'
import { DialogBoks } from '../../felleskomponenter/Dialogboks'
import { Tekst } from '../../felleskomponenter/typografi'

export interface FlyttGosysModalProps {
  open: boolean
  loading: boolean

  onBekreft(): void

  onClose(): void
}

export function FlyttGosysModal(props: FlyttGosysModalProps): ReactElement {
  const { open, loading, onBekreft, onClose } = props
  return (
    <DialogBoks width="500px" onClose={onClose} open={open}>
      <Modal.Content>
        <Heading level="1" size="medium" spacing>
          Vil du flytte saken til Gosys?
        </Heading>
        <Tekst>
          Hvis du flytter saken, vil det bli laget journalføringsoppgave i Gosys hvor du kan behandle den videre.
        </Tekst>
        <Knappepanel>
          <Button
            variant="primary"
            size="small"
            onClick={onBekreft}
            data-cy="btn-flytt-til-gosys"
            disabled={loading}
            loading={loading}
          >
            Flytt til Gosys
          </Button>
          <Button variant="secondary" size="small" onClick={onClose} disabled={loading}>
            Avbryt
          </Button>
        </Knappepanel>
      </Modal.Content>
    </DialogBoks>
  )
}
