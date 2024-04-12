import { Button, Textarea } from '@navikt/ds-react'
import { Avstand } from '../../../felleskomponenter/Avstand'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Notat } from '../../../types/types.internal'
import { postSaksnotat } from '../../../io/http'
import { useInnloggetSaksbehandler } from '../../../state/authentication'
import type { KeyedMutator } from 'swr'

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
      <Textarea label="Nytt notat" size="small" defaultValue="" {...register('innhold', { required: true })} />
      <Avstand marginTop={4}>
        <Button type="submit" size="small" variant="secondary" loading={loading}>
          Lagre notat
        </Button>
      </Avstand>
    </form>
  )
}
