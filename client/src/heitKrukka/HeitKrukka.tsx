import React, { useRef } from 'react'

import { Modal } from '@navikt/ds-react'

export interface HeitKrukkaProps {
  open: boolean
  skjemaUrl?: string
  onClose(): void
}

export const HeitKrukka: React.FC<HeitKrukkaProps> = ({ open, onClose, skjemaUrl }) => {
  const ref = useRef<HTMLDialogElement>(null)

  console.log('Krukka modal', skjemaUrl, open)

  /*if (!skjemaUrl) {
    return null
  }*/

  console.log('Klar for å vise modal', open)

  return (
    <Modal
      ref={ref}
      closeOnBackdropClick={false}
      open={open }
      onClose={onClose}
      width="medium"
      header={{ heading: '', closeButton: true }}
    >
      <Modal.Body>
        <iframe title={'dokument'} src={skjemaUrl} width={'600px'} height={'600px'} />
      </Modal.Body>
    </Modal>
  )
}
