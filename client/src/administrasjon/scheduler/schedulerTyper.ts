export type SchedulerJobStatus = 'WAITING' | 'RUNNING' | 'NOT_SCHEDULED'

export interface SchedulerJob {
  name: string
  status: SchedulerJobStatus
  nextExecution: string | null
  lastSuccess: string | null
  lastFailure: string | null
  consecutiveFailures: number | null
}

export interface SchedulerJobs {
  pod: string
  startedAt: string
  jobs: SchedulerJob[]
}

export interface SchedulerHistoryEntry {
  name: string
  startedAt: string
  finishedAt: string
  durationMillis: number
  result: string
}

export interface SchedulerJobHistory {
  pod: string
  startedAt: string
  entries: SchedulerHistoryEntry[]
}
