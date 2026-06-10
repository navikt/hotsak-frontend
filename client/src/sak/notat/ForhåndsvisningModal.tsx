import { Dialog, DialogProps } from '@navikt/ds-react'

import { DokumentFrame } from '../../felleskomponenter/dokument/DokumentFrame'

export interface ForhåndsvisningModalProps extends Omit<DialogProps, 'children'> {
  data?: string
}

export function ForhåndsvisningModal({ data, ...rest }: ForhåndsvisningModalProps) {
  return (
    <Dialog {...rest}>
      <Dialog.Popup closeOnOutsideClick={true} width="large">
        <Dialog.Header />
        <Dialog.Body>
          <DokumentFrame data={data} />
        </Dialog.Body>
      </Dialog.Popup>
    </Dialog>
  )
}
