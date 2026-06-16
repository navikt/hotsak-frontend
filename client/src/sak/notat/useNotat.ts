import { useMemo } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import useSWRMutation from 'swr/mutation'

import { useToast } from '../../felleskomponenter/toast/useToast'
import { http, type HttpAccept, type HttpAcceptKey } from '../../io/HttpClient'
import { type HttpError } from '../../io/HttpError'
import { useMutateBehandling } from '../v2/behandling/useBehandling'
import {
  type FeilregistrerNotatRequest,
  type FerdigstillNotatRequest,
  type Notat,
  type OppdaterNotatRequest,
} from './notatTyper'
import { useMutateNotater } from './useNotater'

/**
 * Tar med accept i key slik at JSON- og PDF-versjon får hver sin cache.
 */
export function notatKeyOf(sakId: string, notatId: string, accept: HttpAccept = 'application/json'): HttpAcceptKey {
  return [`/api/sak/${sakId}/notater/${notatId}`, accept]
}

export function useNotat(sakId?: string, notatId?: string) {
  const mutateNotater = useMutateNotater()
  const mutateBehandling = useMutateBehandling()
  const { showSuccessToast } = useToast()

  const notatKey = useMemo(() => (sakId && notatId ? notatKeyOf(sakId, notatId) : null), [sakId, notatId])

  const { data: notat, ...rest } = useSWR(notatKey, ([url, accept]) => http.get<Notat>(url, { accept }))

  const oppdaterNotat = useSWRMutation<Notat, HttpError, HttpAcceptKey | null, OppdaterNotatRequest>(
    notatKey,
    ([url], { arg: body }) => http.put(url, body),
    {
      async onSuccess() {
        await mutateNotater(sakId!)
      },
    }
  )

  const forhåndsvisNotat = useSWRMutation<Blob, HttpError, HttpAcceptKey | null>(
    sakId && notatId ? notatKeyOf(sakId, notatId, 'application/pdf') : null,
    async ([url, accept]) => http.get<Blob>(url, { accept }),
    {
      async onSuccess() {},
    }
  )

  const slettNotatUtkast = useSWRMutation<void, HttpError, HttpAcceptKey | null>(
    notatKey,
    ([url]) => http.delete(url),
    {
      async onSuccess() {
        showSuccessToast('Notatet er slettet')
        // todo -> usikker på om det gir mening å oppdatere behandling her,er det bedre å sjekke dette på notater enn gjenstående på behandling?
        await Promise.all([mutateBehandling(sakId!), mutateNotater(sakId!)])
      },
    }
  )

  const ferdigstillNotat = useSWRMutation<void, HttpError, HttpAcceptKey | null, FerdigstillNotatRequest>(
    notatKey,
    ([url], { arg: body }) => http.post(`${url}/ferdigstilling`, body ?? {}),
    {
      async onSuccess() {
        showSuccessToast('Notatet er journalført')
        // todo -> usikker på om det gir mening å oppdatere behandling her,er det bedre å sjekke dette på notater enn gjenstående på behandling?
        await Promise.all([mutateBehandling(sakId!), mutateNotater(sakId!)])
      },
    }
  )

  const feilregistrerNotat = useSWRMutation<string, HttpError, HttpAcceptKey | null, FeilregistrerNotatRequest>(
    notatKey,
    ([url], { arg: body }) => http.post(`${url}/feilregistrering`, body),
    {
      async onSuccess() {
        showSuccessToast('Notatet er feilregistrert')
        await mutateNotater(sakId!)
      },
    }
  )

  return {
    notat,
    oppdaterNotat,
    forhåndsvisNotat,
    slettNotatUtkast,
    ferdigstillNotat,
    feilregistrerNotat,
    ...rest,
  }
}

export type UseNotatResponse = ReturnType<typeof useNotat>

export type SlettNotatUtkastMutationResponse = UseNotatResponse['slettNotatUtkast']

export function useMutateNotat(sakId: string, notatId: string, notat?: Notat) {
  const { mutate } = useSWRConfig()
  return mutate(notatKeyOf(sakId, notatId), notat)
}
