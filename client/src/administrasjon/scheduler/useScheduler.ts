import useSWR from 'swr'

import { http } from '../../io/HttpClient.ts'
import { type HttpError } from '../../io/HttpError.ts'
import { type SchedulerJobHistory, type SchedulerJobs } from './schedulerTyper.ts'

export const schedulerJobsUrl = '/db-scheduler/api/jobs'

export function schedulerHistoryUrl(name: string): string {
  return `${schedulerJobsUrl}/${encodeURIComponent(name)}/history`
}

export function schedulerRunUrl(name: string): string {
  return `${schedulerJobsUrl}/${encodeURIComponent(name)}/run`
}

export function useSchedulerJobs() {
  return useSWR<SchedulerJobs, HttpError>(schedulerJobsUrl, http.get, { shouldRetryOnError: false })
}

export function useSchedulerHistory(name?: string) {
  const key = name ? schedulerHistoryUrl(name) : null
  return useSWR<SchedulerJobHistory, HttpError>(key, http.get, { shouldRetryOnError: false })
}

export async function scheduleJobNow(name: string): Promise<void> {
  await http.post(schedulerRunUrl(name), {})
}
