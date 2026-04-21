import { mutate } from 'swr'

export function mutateSak(sakId?: ID): Promise<Awaited<unknown>[]> {
  if (!sakId) return Promise.resolve([])
  return Promise.all([
    mutate(`/api/sak/${sakId}`),
    mutate(`/api/sak/${sakId}/behandling`),
    mutate(`/api/sak/${sakId}/historikk`),
  ])
}
