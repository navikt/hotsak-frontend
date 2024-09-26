import { mutate } from 'swr'

export function mutateSak(sakId: any): Promise<Awaited<any>[]> {
  return Promise.all([mutate(`api/sak/${sakId}`), mutate(`api/sak/${sakId}/historikk`)])
}
