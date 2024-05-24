import { Tekst } from '../felleskomponenter/typografi'
import { BekreftelseModal } from './komponenter/BekreftelseModal'

interface OvertaSakModalProps {
  open: boolean
  onBekreft: () => void
  loading: boolean
  onClose: () => void
  saksbehandler: string
  type?: string
}

export function OvertaSakModal({
  open,
  saksbehandler,
  onBekreft,
  loading,
  onClose,
  type = 'sak',
}: OvertaSakModalProps) {
  return (
    <BekreftelseModal
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
    </BekreftelseModal>
  )
}
