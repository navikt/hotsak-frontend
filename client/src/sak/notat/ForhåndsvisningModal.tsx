import { Dialog, DialogProps } from '@navikt/ds-react'

import { DokumentFrame } from '../../felleskomponenter/dokument/DokumentFrame'

export interface ForhåndsvisningModalProps extends Omit<DialogProps, 'children'> {
  data?: string
}

export function ForhåndsvisningModal({ data, ...rest }: ForhåndsvisningModalProps) {
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
