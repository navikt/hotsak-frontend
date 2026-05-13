import { mutate, preload } from 'swr'

import { http } from '../io/HttpClient'

// todo -> flytt innhold fra ../saksbilde/useSak.ts hit

export function preloadSak(sakId: ID) {
  return preload(`/api/sak/${sakId}`, http.get)
}

export function preloadBehandling(sakId: ID) {
  return preload(`/api/sak/${sakId}/behandling`, http.get)
}

export function preloadBehovsmelding(sakId: ID) {
  return preload(`/api/sak/${sakId}/behovsmelding`, http.get)
}

export function mutateSak(sakId?: ID): Promise<Awaited<unknown>[]> {
  if (!sakId) return Promise.resolve([])
  return Promise.all([
    mutate(`/api/sak/${sakId}`),
    mutate(`/api/sak/${sakId}/behandling`),
    mutate(`/api/sak/${sakId}/historikk`),
  ])
}
