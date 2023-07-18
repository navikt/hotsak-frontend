import React from 'react'
import styled from 'styled-components'

import { Modal } from '@navikt/ds-react'

import { Brevtype } from '../../../types/types.internal'
import { BrevPanel } from '../../barnebriller/steg/vedtak/brev/BrevPanel'

interface ForhåndsvisningModalProps {
  open: boolean
  sakId: string
  onClose: () => void
}

const StyledModal = styled(Modal)`
  width: 70%;
  height: 90%;
`

export const ForhåndsvisningsModal: React.FC<ForhåndsvisningModalProps> = ({ open, sakId, onClose }) => {
  return (
    <StyledModal
      shouldCloseOnOverlayClick={false}
      open={open}
      onClose={() => {
        onClose()
      }}
    >
      <Modal.Content>
        <BrevPanel sakId={sakId} brevtype={Brevtype.BARNEBRILLER_INNHENTE_OPPLYSNINGER} fullSize={false} />
      </Modal.Content>
    </StyledModal>
  )
}
