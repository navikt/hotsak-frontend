import React from 'react'

import { Tekst } from '../felleskomponenter/typografi'
import { BekreftelsesModal } from './komponenter/BekreftelsesModal'

interface OvertaSakModalProps {
  open: boolean
  onBekreft: () => void
  loading: boolean
  onClose: () => void
  saksbehandler: string
  type?: string
}

export const OvertaSakModal: React.FC<OvertaSakModalProps> = ({
  open,
  saksbehandler,
  onBekreft,
  loading,
  onClose,
  type = 'sak',
}) => {
  return (
    <BekreftelsesModal
      onBekreft={onBekreft}
      width="600px"
      open={open}
      loading={loading}
      buttonLabel={`Overta ${type}en`}
      onClose={() => {
        onClose()
      }}
      heading={`Vil du overta ${type}en?`}
    >
      <Tekst>{`Denne ${type}en er allerede tildelt ${saksbehandler}, er du sikker på at du vil overta ${type}en?`}</Tekst>
    </BekreftelsesModal>
  )
}
