import useSWR, { type SWRConfiguration } from 'swr'

import { Journalposttype } from '../../dokument/dokumentTypes'
import { type HttpError } from '../../io/HttpError'
import { type Saksdokument } from '../../types/types.internal'

export function useSaksdokumenter(
  sakId: string | number,
  shouldFetch = true,
  type = Journalposttype.UTGÅENDE,
  options?: SWRConfiguration<Saksdokument[], HttpError>
) {
  const url = `/api/sak/${sakId}/dokumenter?type=${encodeURIComponent(type)}`
  const { data = ingenDokumenter, ...rest } = useSWR<Saksdokument[], HttpError>(shouldFetch ? url : null, options)
  return {
    data,
    ...rest,
  }
}

const ingenDokumenter: Saksdokument[] = []
