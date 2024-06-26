import { useRef } from 'react'

import { Modal } from '@navikt/ds-react'

import { Brevtype } from '../../../types/types.internal'
import { BrevPanel } from '../../barnebriller/steg/vedtak/brev/BrevPanel'

interface ForhåndsvisningModalProps {
  open: boolean
  sakId: string
  brevtype: Brevtype
  onClose(): void
}

export function ForhåndsvisningsModal({ open, sakId, brevtype, onClose }: ForhåndsvisningModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  return (
    <Modal
      ref={ref}
      closeOnBackdropClick={false}
      open={open}
      onClose={() => {
        onClose()
      }}
      width="70%"
      header={{ heading: '' }}
    >
      <Modal.Body>
        <BrevPanel sakId={sakId} brevtype={brevtype} fullSize={false} />
      </Modal.Body>
    </Modal>
  )
}
