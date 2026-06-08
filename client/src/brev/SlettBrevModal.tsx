import { Tekst } from '../felleskomponenter/typografi'
import { BekreftelsesDialog } from '../saksbilde/komponenter/BekreftelsesDialog'
import { useSlettBrevUtkast } from './breveditor/hooks'

type SlettBrevModalProps = {
  open: boolean
  onClose: () => void
  heading: string
  tekst: string
  width?: string
}

export function SlettBrevModal({ open, onClose, heading, tekst, width }: SlettBrevModalProps) {
  const slettBrevutkast = useSlettBrevUtkast()
  return (
    <BekreftelsesDialog
      heading={heading}
      bekreftButtonLabel={'Slett utkast'}
      bekreftButtonVariant={'danger'}
      onBekreft={() => {
        slettBrevutkast()
        onClose()
      }}
      open={open}
      onClose={onClose}
      width={width}
    >
      <Tekst>{tekst}</Tekst>
    </BekreftelsesDialog>
  )
}
