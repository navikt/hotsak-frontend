import React, { useRef } from 'react'

import { Modal } from '@navikt/ds-react'

export interface HeitKrukkaProps {
  open: boolean
  onClose(): void
}

export const HeitKrukka: React.FC<HeitKrukkaProps> = ({ open, onClose }) => {
  const ref = useRef<HTMLDialogElement>(null)
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
        <iframe
          title={'dokument'}
          src="https://heit-krukka.intern.dev.nav.no/skjema/1"
          width={'600px'}
          height={'600px'}
        />
      </Modal.Body>
    </Modal>
  )
}
