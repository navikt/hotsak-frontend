import { Button, Dialog, InlineMessage } from '@navikt/ds-react'

import { useToast } from '../felleskomponenter/toast/useToast.ts'
import type { Saksbehandlingsoppgave } from '../oppgave/oppgaveTypes.ts'
import { formaterTidsstempel } from '../utils/dato.ts'
import { useBrevActions } from './useBrevActions.ts'

export function AngreSendingAvBrevDialog({
  oppgave,
  brevId,
  open,
  onClose,
  distribueresEtter,
}: {
  oppgave?: Saksbehandlingsoppgave
  brevId: string
  open: boolean
  onClose: () => void
  distribueresEtter?: string
}) {
  const { angreUnderveisBrev } = useBrevActions(oppgave, brevId)
  const { trigger, isMutating, reset } = angreUnderveisBrev
  const { showErrorToast } = useToast()

  const handleClose = () => {
    if (isMutating) {
      return
    }
    reset()
    onClose()
  }

  const handleAngreBrev = async () => {
    reset()

    try {
      await trigger()
      onClose()
    } catch {
      showErrorToast('En feil oppstod ved angring av brevsendingen.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()} size="small">
      <Dialog.Popup closeOnOutsideClick={false} width="500px" aria-label="Angre sending av brev">
        <Dialog.Header>
          <Dialog.Title>Angre sending av brev</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <InlineMessage status="info">
            Er du sikker på at du vil angre sendingen av dette brevet? Det ligger til distribusjon og vil bli sendt{' '}
            {distribueresEtter ? `den ${formaterTidsstempel(distribueresEtter)}` : 'neste virkedag kl 08:00'}.
          </InlineMessage>
        </Dialog.Body>
        <Dialog.Footer>
          <Button type="button" size="small" variant="secondary" onClick={handleClose} disabled={isMutating}>
            Avbryt
          </Button>
          <Button type="button" size="small" loading={isMutating} onClick={handleAngreBrev}>
            Angre brevsending
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  )
}
