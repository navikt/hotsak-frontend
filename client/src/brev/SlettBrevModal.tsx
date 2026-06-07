import { Tekst } from '../felleskomponenter/typografi'
import { BekreftelseModal, type BekreftelseModalProps } from '../saksbilde/komponenter/BekreftelseModal'

export interface SlettBrevModalProps extends Omit<
  BekreftelseModalProps,
  'bekreftButtonLabel' | 'bekreftButtonVariant'
> {
  tekst: string
}

export function SlettBrevModal({ tekst, ...rest }: SlettBrevModalProps) {
  return (
    <BekreftelseModal bekreftButtonLabel="Slett utkast" bekreftButtonVariant="danger" {...rest}>
      <Tekst>{tekst}</Tekst>
    </BekreftelseModal>
  )
}
