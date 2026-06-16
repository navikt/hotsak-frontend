import { Dialog, type DialogProps } from '@navikt/ds-react'

import { DokumentFrame } from './DokumentFrame'

export interface ForhåndsvisDokumentModalProps extends Omit<DialogProps, 'children'> {
  data?: Blob
}

export function ForhåndsvisDokumentModal({ data, ...rest }: ForhåndsvisDokumentModalProps) {
  return (
    <Dialog size="small" {...rest}>
      <Dialog.Popup closeOnOutsideClick={true} height="100%" width="80%">
        <Dialog.Header />
        <Dialog.Body>
          <DokumentFrame data={data} />
        </Dialog.Body>
      </Dialog.Popup>
    </Dialog>
  )
}
