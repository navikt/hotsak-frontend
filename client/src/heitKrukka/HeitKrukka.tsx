import { useRef } from 'react'

import { Box, Modal } from '@navikt/ds-react'

export interface HeitKrukkaProps {
  open: boolean
  skjemaUrl?: string
  onClose(): void
}

export function HeitKrukka({ open, onClose, skjemaUrl }: HeitKrukkaProps) {
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
        <Box padding="2">
          <iframe title={'dokument'} src={skjemaUrl} width={'600px'} height={'600px'} />
        </Box>
      </Modal.Body>
    </Modal>
  )
}
