import { useDebugValue } from 'react'
import { useParams } from 'react-router'
import useSwr, { mutate, preload, type SWRResponse } from 'swr'
import useSWRImmutable from 'swr/immutable'

import { http } from '../io/HttpClient.ts'
import { type HttpError } from '../io/HttpError.ts'
import {
  erOppgaveId,
  type Oppgave,
  type OppgaveId,
  type OppgaveMappe,
  type OppgaveMapperResponse,
} from './oppgaveTypes.ts'

export function useOppgaveId(): OppgaveId | undefined {
  const { oppgaveId } = useParams<{ oppgaveId: OppgaveId | string }>()
  useDebugValue(oppgaveId)
  if (erOppgaveId(oppgaveId)) {
    return oppgaveId
  }
  return
}

export interface UseOppgaveResponse extends Omit<SWRResponse<Oppgave, HttpError>, 'data'> {
  oppgave: Oppgave
}

export function useOppgave(): UseOppgaveResponse {
  const oppgaveId = useOppgaveId()
  const { data: oppgave, ...rest } = useSwr<Oppgave>(oppgaveId ? `/api/oppgaver/${oppgaveId}` : null, {
    suspense: true,
  })
  return {
    // eslint-disable-next-line @typescript-eslint/no-extra-non-null-assertion
    oppgave: oppgave!!,
    ...rest,
  }
}

export function useOppgaveMapper(): ReadonlyArray<OppgaveMappe> {
  const { data } = useSWRImmutable<OppgaveMapperResponse[]>('/api/oppgaver/mapper')
  return data?.flatMap((page) => page.mapper) ?? []
}

export function preloadOppgave(oppgaveId: OppgaveId) {
  return preload(`/api/oppgaver/${oppgaveId}`, http.get)
}

export function mutateOppgave(oppgaveId: OppgaveId, oppgave?: Oppgave) {
  return mutate(`/api/oppgaver/${oppgaveId}`, oppgave)
}
