import { Button, Dialog, InlineMessage } from '@navikt/ds-react'

import { useToast } from '../felleskomponenter/toast/useToast.ts'
import { Saksbehandlingsoppgave } from '../oppgave/oppgaveTypes.ts'
import { useBrevActions } from './useBrevActions.ts'

export function SendBrevDialog({
  oppgave,
  brevId,
  open,
  onClose,
}: {
  oppgave: Saksbehandlingsoppgave
  brevId: string
  open: boolean
  onClose: () => void
}) {
  const { sendUnderveisBrev } = useBrevActions(oppgave, brevId)
  const { trigger, isMutating, reset } = sendUnderveisBrev
  const { showErrorToast } = useToast()

  const handleClose = () => {
    if (isMutating) {
      return
    }
    reset()
    onClose()
  }

  const handleSendBrev = async () => {
    reset()

    try {
      await trigger()
      onClose()
    } catch {
      showErrorToast('En feil oppstod ved sending av brevet.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()} size="small">
      <Dialog.Popup closeOnOutsideClick={false} width="500px" aria-label="Send brev">
        <Dialog.Header>
          <Dialog.Title>Send brev</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <InlineMessage status="info">
            Brevet vil sendes 08:00 påfølgende virkedag. Frem til da kan du angre sendingen.
          </InlineMessage>
        </Dialog.Body>
        <Dialog.Footer>
          <Button type="button" size="small" variant="secondary" onClick={handleClose} disabled={isMutating}>
            Avbryt
          </Button>
          <Button type="button" size="small" loading={isMutating} onClick={handleSendBrev}>
            Send brev
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  )
}
