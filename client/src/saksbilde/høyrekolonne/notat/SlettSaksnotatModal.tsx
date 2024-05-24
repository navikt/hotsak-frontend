import { useState } from 'react'
import type { KeyedMutator } from 'swr'

import { Brødtekst } from '../../../felleskomponenter/typografi'
import { slettSaksnotat } from '../../../io/http'
import type { Notat } from '../../../types/types.internal'
import { BekreftelseModal } from '../../komponenter/BekreftelseModal'

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
    <BekreftelseModal
      open={!!notatId}
      onBekreft={onDelete}
      onClose={onClose}
      heading="Er du sikker?"
      loading={loading}
      buttonLabel="Slett"
      buttonVariant="danger"
    >
      <Brødtekst>Er du sikker på at du vil slette notatet?</Brødtekst>
    </BekreftelseModal>
  )
}
