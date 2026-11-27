import { http, HttpResponse } from 'msw'
import { type SchedulerHistoryEntry, type SchedulerJob } from '../../administrasjon/scheduler/schedulerTyper.ts'

const pod = 'hotsak-api-lokal'

export function schedulerHandlers() {
  const startet = new Date()
  const startetAt = new Date(startet.getTime() - 6 * 60 * 60_000).toISOString()
  const nylig = (minutterSiden: number) => new Date(startet.getTime() - minutterSiden * 60_000).toISOString()
  const jobs: SchedulerJob[] = [
    {
      name: 'oppdater-oppgaver',
      status: 'WAITING',
      nextExecution: nylig(-30),
      lastSuccess: nylig(180),
      lastFailure: nylig(60),
      consecutiveFailures: 2,
    },
    {
      name: 'synkroniser-brukere',
      status: 'RUNNING',
      nextExecution: nylig(15),
      lastSuccess: nylig(45),
      lastFailure: null,
      consecutiveFailures: 0,
    },
    {
      name: 'oppfrisk-hurtigbuffer',
      status: 'NOT_SCHEDULED',
      nextExecution: null,
      lastSuccess: null,
      lastFailure: null,
      consecutiveFailures: null,
    },
  ]
  const history: SchedulerHistoryEntry[] = [
    {
      name: 'oppdater-oppgaver',
      startedAt: nylig(60),
      finishedAt: new Date(new Date(nylig(60)).getTime() + 42_000).toISOString(),
      durationMillis: 42_000,
      result: 'FAILURE',
    },
    {
      name: 'oppdater-oppgaver',
      startedAt: nylig(180),
      finishedAt: new Date(new Date(nylig(180)).getTime() + 39_000).toISOString(),
      durationMillis: 39_000,
      result: 'SUCCESS',
    },
    {
      name: 'synkroniser-brukere',
      startedAt: nylig(45),
      finishedAt: new Date(new Date(nylig(45)).getTime() + 37_000).toISOString(),
      durationMillis: 37_000,
      result: 'SUCCESS',
    },
    {
      name: 'oppfrisk-hurtigbuffer',
      startedAt: nylig(300),
      finishedAt: new Date(new Date(nylig(300)).getTime() + 8_000).toISOString(),
      durationMillis: 8_000,
      result: 'SUCCESS',
    },
  ]

  return [
    http.get('/db-scheduler/api/jobs', () =>
      HttpResponse.json({
        pod,
        startedAt: startetAt,
        jobs: jobs.map((job) => ({ ...job })),
      })
    ),
    http.get<{ name: string }>('/db-scheduler/api/jobs/:name/history', ({ params }) => {
      const { name } = params
      if (!jobs.some((job) => job.name === name)) {
        return HttpResponse.json(
          { title: 'Not Found', status: 404 },
          { status: 404, headers: { 'Content-Type': 'application/problem+json' } }
        )
      }

      return HttpResponse.json({
        pod,
        startedAt: startetAt,
        entries: history
          .filter((entry) => entry.name === name)
          .slice(0, 100)
          .map((entry) => ({ ...entry })),
      })
    }),
    http.post<{ name: string }>('/db-scheduler/api/jobs/:name/run', ({ params }) => {
      const { name } = params
      const job = jobs.find((entry) => entry.name === name)
      if (!job || job.status === 'NOT_SCHEDULED') {
        return HttpResponse.json(
          { title: 'Not Found', status: 404 },
          { status: 404, headers: { 'Content-Type': 'application/problem+json' } }
        )
      }
      if (job.status === 'RUNNING') {
        return HttpResponse.json(
          { title: 'Conflict', status: 409 },
          { status: 409, headers: { 'Content-Type': 'application/problem+json' } }
        )
      }

      job.nextExecution = new Date().toISOString()
      return new HttpResponse(null, { status: 204 })
    }),
  ]
}
