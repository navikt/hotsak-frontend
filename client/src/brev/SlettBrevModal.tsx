import { BekreftelseModal } from '../saksbilde/komponenter/BekreftelseModal'

type SlettBrevModalProps = {
  onSlettBrev: () => void
  open: boolean
  onClose: () => void
}

export function SlettBrevModal({ onSlettBrev, open, onClose }: SlettBrevModalProps) {
  return (
    <BekreftelseModal
      heading={'Vil du slettet brevutkastet?'}
      bekreftButtonLabel={'Slett utkast'}
      bekreftButtonVariant={'danger'}
      onBekreft={onSlettBrev}
      open={open}
      onClose={onClose}
    >
      <p>Du er i ferd med å slette brevutkastet. Dette kan ikke angres.</p>
    </BekreftelseModal>
  )
}
