import { Tekst } from '../felleskomponenter/typografi'
import { BekreftelsesDialog, type BekreftelsesDialogProps } from '../saksbilde/komponenter/BekreftelsesDialog'

export interface SlettBrevModalProps extends Omit<
  BekreftelsesDialogProps,
  'bekreftButtonLabel' | 'bekreftButtonVariant'
> {
  tekst: string
}

export function SlettBrevModal({ tekst, ...rest }: SlettBrevModalProps) {
  return (
    <BekreftelsesDialog bekreftButtonLabel="Slett utkast" bekreftButtonVariant="danger" {...rest}>
      <Tekst>{tekst}</Tekst>
    </BekreftelsesDialog>
  )
}
