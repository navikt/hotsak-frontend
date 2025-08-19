import { Tekst } from '../felleskomponenter/typografi.tsx'
import { BekreftelseModal } from '../saksbilde/komponenter/BekreftelseModal.tsx'

export interface OvertaOppgaveModalProps {
  open: boolean
  onBekreft: () => void
  loading: boolean
  onClose: () => void
  saksbehandler: string
  type?: string
}

export function OvertaOppgaveModal({
  open,
  saksbehandler,
  onBekreft,
  loading,
  onClose,
  type = 'sak',
}: OvertaOppgaveModalProps) {
  return (
    <BekreftelseModal
      onBekreft={onBekreft}
      width="600px"
      open={open}
      loading={loading}
      bekreftButtonLabel={`Overta ${type}en`}
      onClose={() => {
        onClose()
      }}
      heading={`Vil du overta ${type}en?`}
    >
      <Tekst>{`Denne ${type}en er allerede tildelt ${saksbehandler}, er du sikker på at du vil overta ${type}en?`}</Tekst>
    </BekreftelseModal>
  )
}
