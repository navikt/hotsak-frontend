import { ModalProps } from '@navikt/ds-react'
import { Tekst } from '../felleskomponenter/typografi'
import { BekreftelseModal } from '../saksbilde/komponenter/BekreftelseModal'
import { useSlettBrevUtkast } from './breveditor/hooks'

type SlettBrevModalProps = {
  open: boolean
  onClose: () => void
  heading: string
  tekst: string
  width?: ModalProps['width']
}

export function SlettBrevModal({ open, onClose, heading, tekst, width }: SlettBrevModalProps) {
  const slettBrevutkast = useSlettBrevUtkast()
  return (
    <BekreftelseModal
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
    </BekreftelseModal>
  )
}
