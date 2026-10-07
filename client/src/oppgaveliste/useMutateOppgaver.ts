import { useSWRConfig } from 'swr'

import { isString } from '../utils/type.ts'

export function useMutateOppgaver(): () => Promise<void> {
  const { mutate } = useSWRConfig()
  return async () => {
    await mutate((key) => {
      const url = Array.isArray(key) ? key[0] : key
      return isString(url) && url.startsWith('/api/oppgaver')
    })
  }
}
