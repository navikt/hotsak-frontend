import React, { useRef } from 'react'

import { Modal } from '@navikt/ds-react'

import { Brevtype } from '../../../types/types.internal'
import { BrevPanel } from '../../barnebriller/steg/vedtak/brev/BrevPanel'

interface ForhåndsvisningModalProps {
  open: boolean
  sakId: string
  onClose: () => void
}

export const ForhåndsvisningsModal: React.FC<ForhåndsvisningModalProps> = ({ open, sakId, onClose }) => {
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
        <BrevPanel sakId={sakId} brevtype={Brevtype.BARNEBRILLER_INNHENTE_OPPLYSNINGER} fullSize={false} />
      </Modal.Body>
    </Modal>
  )
}
