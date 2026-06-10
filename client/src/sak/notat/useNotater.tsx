import { useMemo } from 'react'
import useSwr, { useSWRConfig } from 'swr'
import useSWRMutation from 'swr/mutation'

import { http } from '../../io/HttpClient.ts'
import { type HttpError } from '../../io/HttpError.ts'
import { mutateBehandling } from '../v2/behandling/useBehandling.ts'
import { isAvventerJournalføring, isNotatFerdigstilt, isNotatUtkast } from './notatSelectors.ts'
import { OpprettNotatRequest, type Notat, type Saksnotater } from './notatTyper.ts'

export function useNotater(sakId?: string) {
  const key = sakId ? `/api/sak/${sakId}/notater` : null

  const { data, ...rest } = useSwr<Saksnotater, HttpError>(key, {
    refreshInterval(latestData) {
      if (!latestData) return 0
      const avventerJournalføring = latestData.notater.some(isAvventerJournalføring)
      return avventerJournalføring ? 2000 : 0
    },
  })

  const { notater: alleNotater, totalElements: antallNotater } = data ?? noData

  const opprettNotat = useSWRMutation<Notat, HttpError, string | null, OpprettNotatRequest>(
    key,
    (url, { arg: body }) => http.post<OpprettNotatRequest, Notat>(url, body),
    {
      async onSuccess() {
        await Promise.all([mutateBehandling(sakId!)])
      },
    }
  )

  const notater = useMemo(
    () => ({
      utkast: alleNotater.filter(isNotatUtkast),
      ferdigstilte: alleNotater.filter(isNotatFerdigstilt),
    }),
    [alleNotater]
  )

  return {
    notater,
    antallNotater,
    harUtkast: notater.utkast.length > 0,
    gjeldendeUtkast: notater.utkast[0], // antar at vi ikke har flere utkast pt.
    opprettNotat,
    ...rest,
  }
}

export function useMutateNotater() {
  const { mutate } = useSWRConfig()
  return (sakId: string) => mutate(`/api/sak/${sakId}/notater`)
}

const noData: Saksnotater = { notater: [], totalElements: 0 }
