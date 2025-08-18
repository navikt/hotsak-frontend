import { Button, Modal } from '@navikt/ds-react'
import { useRef } from 'react'
import { Tekst } from '../felleskomponenter/typografi.tsx'
import { Saksbehandler } from '../types/types.internal.ts'

export interface OppgavetildelingKonfliktModalProps {
  open: boolean
  onClose: () => void
  onPrimaryAction?: () => void
  saksbehandler?: Saksbehandler
}

export function OppgavetildelingKonfliktModal({
  open,
  onClose,
  onPrimaryAction,
  saksbehandler,
}: OppgavetildelingKonfliktModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  return (
    <div
      /* This is a hack to disable onClick propagation from the modal and its backsplash to the table row onClick-handler,
      it also overrides some css-rules used in the table rows for text-wrapping and the cursor. */
      style={{
        cursor: open ? 'default' : undefined,
        position: 'absolute',
        display: open ? 'block' : 'none',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      onClick={(e) => open && e.stopPropagation()}
    >
      <Modal
        ref={ref}
        closeOnBackdropClick={false}
        width={'500px'}
        open={open}
        onClose={onClose}
        header={{ heading: `Saken er allerede tatt` }}
      >
        <Modal.Body style={{ textWrap: 'wrap' }}>
          <Tekst spacing={true}>
            {`Denne saken ble tatt av en annen saksbehandler før deg.`}
            {saksbehandler && ` Saken behandles nå av ${saksbehandler.navn}.`}
          </Tekst>
          {onPrimaryAction && <Tekst spacing={true}>{`Hvis dette er feil kan du åpne saken og overta den.`}</Tekst>}
          {!onPrimaryAction && <Tekst spacing={true}>{`Hvis dette er feil kan du overta saken.`}</Tekst>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" size="small" onClick={onClose} disabled={false}>
            Lukk
          </Button>
          {onPrimaryAction && (
            <Button variant={'secondary'} size="small" onClick={onPrimaryAction} disabled={false} loading={false}>
              Åpne sak
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  )
}
