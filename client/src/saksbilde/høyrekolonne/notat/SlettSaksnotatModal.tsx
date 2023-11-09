import { Button, Modal } from '@navikt/ds-react'
import { slettSaksnotat } from '../../../io/http'
import { useState } from 'react'
import type { KeyedMutator } from 'swr'
import type { Notat } from '../../../types/types.internal'

export interface SlettSaksnotatModalProps {
  sakId: string
  notatId: number
  mutate: KeyedMutator<Notat[]>

  onClose(): void
}

export function SlettSaksnotatModal(props: SlettSaksnotatModalProps) {
  const { sakId, notatId, mutate, onClose } = props

  const [loading, setLoading] = useState(false)

  const onDelete = async () => {
    setLoading(true)
    await slettSaksnotat(sakId, notatId)
    await mutate()
    setLoading(false)
    onClose()
  }

  return (
    <Modal open={!!notatId} onClose={onClose} closeOnBackdropClick={false} header={{ heading: 'Er du sikker?' }}>
      <Modal.Body>Er du sikker på at du vil slette notatet?</Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="danger" loading={loading} onClick={onDelete}>
          Slett
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
