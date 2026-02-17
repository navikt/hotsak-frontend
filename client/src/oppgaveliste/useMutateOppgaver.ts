import { useSWRConfig } from 'swr'

import { isString } from '../utils/type.ts'

export function useMutateOppgaver(): () => Promise<void> {
  const { mutate } = useSWRConfig()
  return async () => {
    await mutate((key) => isString(key) && key.startsWith('/api/oppgaver-v2'), undefined, { revalidate: true })
  }
}
