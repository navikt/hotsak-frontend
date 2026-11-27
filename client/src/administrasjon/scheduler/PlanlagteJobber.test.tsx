import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { type SchedulerJob, type SchedulerJobHistory, type SchedulerJobs } from './schedulerTyper.ts'
import PlanlagteJobber from './PlanlagteJobber.tsx'

const tilgang = vi.hoisted(() => ({ erIkkeProd: true }))

vi.mock('../../utils/useMiljø.ts', () => ({
  useMiljø: () => tilgang,
}))

const jobb: SchedulerJob = {
  name: 'nightly job',
  status: 'WAITING',
  nextExecution: '2026-11-27T14:00:00Z',
  lastSuccess: null,
  lastFailure: null,
  consecutiveFailures: null,
}

const jobber: SchedulerJobs = {
  pod: 'scheduler-pod-a',
  startedAt: '2026-11-27T10:00:00Z',
  jobs: [
    jobb,
    { ...jobb, name: 'running job', status: 'RUNNING' },
    { ...jobb, name: 'unscheduled job', status: 'NOT_SCHEDULED' },
  ],
}

const tomHistorikk: SchedulerJobHistory = {
  pod: 'scheduler-pod-a',
  startedAt: '2026-11-27T10:00:00Z',
  entries: [],
}

let kjøresvar = 204
let forespørsler: Array<{
  url: string
  method: string
  body: BodyInit | null | undefined
  contentType: string | null
}> = []

function MedTomSWRCache({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        fetcher: (url: string) => fetch(url).then((response) => response.json()),
        dedupingInterval: 0,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  )
}

function renderSide() {
  return render(<PlanlagteJobber />, { wrapper: MedTomSWRCache })
}

describe('PlanlagteJobber', () => {
  beforeEach(() => {
    tilgang.erIkkeProd = true
    kjøresvar = 204
    forespørsler = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input)
        const method = init?.method ?? 'GET'
        forespørsler.push({
          url,
          method,
          body: init?.body,
          contentType: new Headers(init?.headers).get('Content-Type'),
        })

        if (method === 'POST') return new Response(null, { status: kjøresvar })
        if (url.includes('/history')) return Response.json(tomHistorikk)
        return Response.json(jobber)
      })
    )
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('viser statuser, og bare jobber som venter kan åpne bekreftelsen', async () => {
    const user = userEvent.setup()
    renderSide()

    expect(await screen.findByText('Venter')).toBeVisible()
    expect(screen.getByText('Kjører')).toBeVisible()
    expect(screen.getByText('Ikke planlagt')).toBeVisible()
    expect(within(screen.getByRole('row', { name: /nightly job/ })).getByRole('cell', { name: 'Ukjent' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Kjør running job nå' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Kjør unscheduled job nå' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Kjør nightly job nå' }))
    const dialog = screen.getByRole('alertdialog')
    expect(within(dialog).getByText(window.appSettings.NAIS_CLUSTER_NAME ?? 'Ukjent')).toBeInTheDocument()
    expect(forespørsler.filter(({ method }) => method === 'POST')).toHaveLength(0)

    await user.click(within(dialog).getByRole('button', { name: 'Avbryt' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    expect(forespørsler.filter(({ method }) => method === 'POST')).toHaveLength(0)
  })

  it('sender én bekreftet POST med JSON og oppdaterer oversikt og historikk', async () => {
    const user = userEvent.setup()
    renderSide()
    await screen.findByText('Venter')
    await user.click(screen.getByRole('button', { name: 'Vis historikk for nightly job' }))
    await screen.findByText(/Pod startet:/)

    await user.click(screen.getByRole('button', { name: 'Kjør nightly job nå' }))
    await user.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Kjør nå' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Jobben er planlagt for kjøring nå')
    const post = forespørsler.find(({ method }) => method === 'POST')
    expect(post).toEqual({
      url: '/db-scheduler/api/jobs/nightly%20job/run',
      method: 'POST',
      body: '{}',
      contentType: 'application/json',
    })
    await waitFor(() => {
      expect(
        forespørsler.filter(({ method, url }) => method === 'GET' && url === '/db-scheduler/api/jobs')
      ).toHaveLength(2)
      expect(
        forespørsler.filter(({ method, url }) => method === 'GET' && url.endsWith('/nightly%20job/history'))
      ).toHaveLength(2)
    })
  })

  it.each([
    [409, 'Jobben kjører allerede. Oversikten oppdateres.'],
    [500, 'Kunne ikke bekrefte at jobben ble planlagt. Oppdater status før du prøver igjen.'],
  ])('viser feilmelding for POST-status %i uten automatisk nytt forsøk', async (status, melding) => {
    kjøresvar = status
    const user = userEvent.setup()
    renderSide()
    await screen.findByText('Venter')
    await user.click(screen.getByRole('button', { name: 'Kjør nightly job nå' }))
    await user.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Kjør nå' }))

    expect(await within(screen.getByRole('alertdialog')).findByText(melding)).toBeVisible()
    expect(forespørsler.filter(({ method }) => method === 'POST')).toHaveLength(1)
  })

  it('viser podmetadata, restartadvarsel og tom historikk, med manuell retry', async () => {
    const user = userEvent.setup()
    renderSide()
    await screen.findByText('Venter')
    await user.click(screen.getByRole('button', { name: 'Vis historikk for nightly job' }))

    expect(await screen.findByText('scheduler-pod-a')).toBeVisible()
    expect(screen.getByText(/Pod startet:/)).toBeVisible()
    expect(screen.getByText(/Kjøringer på andre pods vises ikke/)).toBeVisible()
    expect(screen.getByText('Ingen historikk er registrert for denne jobben på poden.')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Oppdater historikk' }))
    await waitFor(() => {
      expect(
        forespørsler.filter(({ method, url }) => method === 'GET' && url.endsWith('/nightly%20job/history'))
      ).toHaveLength(2)
    })
  })

  it('henter ikke schedulerdata når siden er avvist', () => {
    tilgang.erIkkeProd = false
    renderSide()

    expect(screen.getByText('Du mangler tilgang til denne ressursen.')).toBeVisible()
    expect(forespørsler).toHaveLength(0)
  })
})
