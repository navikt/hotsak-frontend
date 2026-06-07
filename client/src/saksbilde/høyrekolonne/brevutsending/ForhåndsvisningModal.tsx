import { useRef } from 'react'

import { Modal } from '@navikt/ds-react'

import { BrevPanel } from '../../barnebriller/steg/vedtak/brev/BrevPanel'

export interface ForhåndsvisningModalProps {
  brevId?: string
  open: boolean
  onClose(): void
}

export function ForhåndsvisningModal({ brevId, open, onClose }: ForhåndsvisningModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  return (
    <Modal ref={ref} closeOnBackdropClick={false} open={open} onClose={onClose} width="70%" header={{ heading: '' }}>
      <Modal.Body>
        <BrevPanel brevId={open ? brevId : undefined} fullSize={false} />
      </Modal.Body>
    </Modal>
  )
}
