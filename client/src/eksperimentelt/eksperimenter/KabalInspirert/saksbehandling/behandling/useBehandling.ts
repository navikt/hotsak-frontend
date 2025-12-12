import useSwr, { KeyedMutator } from 'swr'

import { useSakId } from '../../../../../saksbilde/useSak.ts'
import { BehandlingerForSak } from '../../../../../types/behandlingTyper.ts'
import { useMiljø } from '../../../../../utils/useMiljø.ts'

export interface Dataesponse extends BehandlingerForSak {
  error: any
  isLoading: boolean
  mutate: KeyedMutator<Dataesponse>
}

export function useBehandling(): Dataesponse {
  const sakId = useSakId()

  const { mswAktivert } = useMiljø()

  console.log(`useBehandling kjører kun hvis msw er aktivert frem til API er klart mswAktivert:  ${mswAktivert}`)
  const {
    data: behandling,
    error,
    isLoading,
    mutate,
  } = useSwr<Dataesponse>(mswAktivert && sakId ? `/api/sak/${sakId}/behandling` : null)

  return {
    behandlinger: behandling?.behandlinger || [],
    gjeldendeBehandling: behandling?.behandlinger[0],
    error,
    isLoading,
    mutate,
  }
}
