import { Button, ReadMore, Textarea, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { KeyedMutator } from 'swr'

import { postSaksnotat } from '../../../io/http'
import { useInnloggetSaksbehandler } from '../../../state/authentication'
import type { Notat } from '../../../types/types.internal'

export interface LagreSaksnotatFormProps {
  sakId: string
  mutate: KeyedMutator<Notat[]>
}

export function LagreSaksnotatForm(props: LagreSaksnotatFormProps) {
  const { sakId, mutate } = props
  const { register, handleSubmit, reset } = useForm<{ innhold: string }>()
  const saksbehandler = useInnloggetSaksbehandler()
  const [loading, setLoading] = useState(false)

  const lagreNotat = handleSubmit(async ({ innhold }) => {
    const nyttNotat: Notat = {
      id: Math.random(),
      sakId,
      saksbehandler,
      type: 'INTERNT',
      innhold,
      opprettet: new Date().toISOString(),
    }
    setLoading(true)
    await postSaksnotat(nyttNotat.sakId, nyttNotat.type, nyttNotat.innhold)
    await mutate()
    reset({ innhold: '' })
    setLoading(false)
  })

  return (
    <form onSubmit={lagreNotat}>
      <VStack gap="3">
        <Textarea label="Nytt notat" size="small" defaultValue="" {...register('innhold', { required: true })} />
        <ReadMore size="small" header="Definisjon av notat">
          Her kan vi forklare SB hva et internt notat er, eller hva vi velger å kalle det.
        </ReadMore>
        <div>
          <Button type="submit" size="small" variant="secondary" loading={loading}>
            Lagre notat
          </Button>
        </div>
      </VStack>
    </form>
  )
}
