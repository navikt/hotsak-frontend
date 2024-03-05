import React, { useRef } from 'react'

import { Modal } from '@navikt/ds-react'
import { Avstand } from '../felleskomponenter/Avstand'

export interface HeitKrukkaProps {
  open: boolean
  skjemaUrl?: string
  onClose(): void
}

export const HeitKrukka: React.FC<HeitKrukkaProps> = ({ open, onClose, skjemaUrl }) => {
  const ref = useRef<HTMLDialogElement>(null)

  console.log('Krukka modal', skjemaUrl, open)

  return (
    <Modal
      ref={ref}
      closeOnBackdropClick={false}
      open={open}
      onClose={onClose}
      width="medium"
      header={{ heading: '', closeButton: true }}
    >
      <Modal.Body>
        <Avstand paddingLeft={2} paddingRight={2}>
          <iframe title={'dokument'} src={skjemaUrl} width={'600px'} height={'600px'} />
        </Avstand>
      </Modal.Body>
    </Modal>
  )
}
