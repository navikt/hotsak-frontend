import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { type ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { http } from '../../io/HttpClient.ts'
import { type Brevmottaker, type LeggTilMottakerRequest, Mottakertype } from '../brevTyper.ts'
import { useBrukerSomMottaker } from '../useBrukerSomMottaker.ts'

const { showErrorToast } = vi.hoisted(() => ({ showErrorToast: vi.fn() }))
vi.mock('../../felleskomponenter/toast/useToast.ts', () => ({ useToast: () => ({ showErrorToast }) }))
vi.mock('../../saksbilde/useSak.ts', () => ({
  useSak: () => ({ sak: { data: { bruker: { fnr: '01019012345' } } } }),
  useSakId: () => 'sak-1',
}))

const brukerFnr = '01019012345'
const feilmelding = 'Kunne ikke oppdatere mottakerne. Prøv igjen.'

let mottakere: Brevmottaker[]
let posts: LeggTilMottakerRequest[]
let deletes: string[]
let feilVedEndring: boolean
let ventPåEndring: Promise<void> | undefined
let ventPåHenting: Promise<void> | undefined
let antallVerger: number

function lagMottaker(request: LeggTilMottakerRequest): Brevmottaker {
  return {
    ...request,
    id: `${request.mottakertype}-${request.fnr ?? 'formidler'}`,
    brevId: 'brev-1',
    opprettet: '2026-11-25T12:00:00Z',
    opprettetAv: 'Z123456',
    kanSlettes: request.mottakertype !== Mottakertype.FORMIDLER,
  }
}

function MedTomCache({ children }: { children: ReactNode }) {
  return (
    <SWRConfig value={{ provider: () => new Map(), fetcher: http.get, dedupingInterval: 0, shouldRetryOnError: false }}>
      {children}
    </SWRConfig>
  )
}

async function renderMottakervalg() {
  const hook = renderHook(() => useBrukerSomMottaker('brev-1'), { wrapper: MedTomCache })
  await waitFor(() => expect(hook.result.current.kanEndre).toBe(true))
  return hook
}

describe('useBrukerSomMottaker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    posts = []
    deletes = []
    feilVedEndring = false
    ventPåEndring = undefined
    ventPåHenting = undefined
    antallVerger = 2
    mottakere = [lagMottaker({ mottakertype: Mottakertype.FORMIDLER, navn: 'Formidler' })]
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, options?: RequestInit) => {
        const metode = options?.method
        if (metode !== 'POST' && metode !== 'DELETE') {
          await ventPåHenting
          return Response.json({ brevmottakere: mottakere })
        }

        await ventPåEndring
        if (feilVedEndring) return new Response(null, { status: 500 })

        // Simulert backend: BRUKER og verger legges til og fjernes i samme transaksjon.
        if (metode === 'POST') {
          const request: LeggTilMottakerRequest = JSON.parse(String(options?.body))
          posts.push(request)
          mottakere.push(
            lagMottaker(request),
            ...Array.from({ length: antallVerger }, (_, i) =>
              lagMottaker({ mottakertype: Mottakertype.VERGE, fnr: `0${i + 2}029012345` })
            )
          )
        } else {
          const id = String(input).split('/').at(-1)!
          deletes.push(id)
          mottakere = mottakere.filter((mottaker) => mottaker.id !== id && mottaker.mottakertype !== Mottakertype.VERGE)
        }
        return new Response(null, { status: 204 })
      })
    )
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it.each([0, 2])('legger til bruker med én POST når backend oppretter %i verger', async (verger) => {
    antallVerger = verger
    const { result } = await renderMottakervalg()
    expect(result.current.valgt).toBe(false)

    await act(() => result.current.velgBruker(true))

    expect(posts).toEqual([{ mottakertype: Mottakertype.BRUKER, fnr: brukerFnr }])
    expect(mottakere.filter((mottaker) => mottaker.mottakertype === Mottakertype.VERGE)).toHaveLength(verger)
    await waitFor(() => expect(result.current.valgt).toBe(true))
    await waitFor(() => expect(result.current.kanSende).toBe(true))
  })

  it.each([
    ['legge til', true],
    ['fjerne', false],
  ])('sperrer valg og sending til mottakerlisten er oppdatert etter å %s bruker', async (_, skalMotta) => {
    if (!skalMotta) mottakere.push(lagMottaker({ mottakertype: Mottakertype.BRUKER, fnr: brukerFnr }))
    const { result } = await renderMottakervalg()
    let fullfør!: () => void
    ventPåHenting = new Promise<void>((resolve) => {
      fullfør = resolve
    })

    await act(() => result.current.velgBruker(skalMotta))

    expect(result.current.lagrer).toBe(false)
    expect(result.current.valgt).toBe(!skalMotta)
    expect(result.current.kanEndre).toBe(false)
    expect(result.current.kanSende).toBe(false)

    await act(async () => fullfør())

    await waitFor(() => expect(result.current.kanSende).toBe(true))
    expect(result.current.kanEndre).toBe(true)
    expect(result.current.valgt).toBe(skalMotta)
  })

  it('fjerner bruker med én DELETE, og formidler beholdes', async () => {
    mottakere.push(lagMottaker({ mottakertype: Mottakertype.BRUKER, fnr: brukerFnr }))
    mottakere.push(lagMottaker({ mottakertype: Mottakertype.VERGE, fnr: '02029012345' }))
    const { result } = await renderMottakervalg()
    expect(result.current.valgt).toBe(true)

    await act(() => result.current.velgBruker(false))

    expect(deletes).toEqual([`BRUKER-${brukerFnr}`])
    expect(mottakere.map((mottaker) => mottaker.mottakertype)).toEqual([Mottakertype.FORMIDLER])
    await waitFor(() => expect(result.current.valgt).toBe(false))
  })

  it('bestemmer valgt ut fra BRUKER, ikke verger', async () => {
    mottakere.push(lagMottaker({ mottakertype: Mottakertype.VERGE, fnr: '02029012345' }))
    const { result } = await renderMottakervalg()

    expect(result.current.valgt).toBe(false)
  })

  it('blokkerer valg og sending mens en endring pågår', async () => {
    let fullfør!: () => void
    ventPåEndring = new Promise<void>((resolve) => {
      fullfør = resolve
    })
    const { result } = await renderMottakervalg()

    let oppdatering!: Promise<void>
    act(() => {
      oppdatering = result.current.velgBruker(true)
    })
    await waitFor(() => expect(result.current.lagrer).toBe(true))
    expect(result.current.kanEndre).toBe(false)
    expect(result.current.kanSende).toBe(false)

    await act(async () => {
      fullfør()
      await oppdatering
    })
    expect(posts).toHaveLength(1)
    expect(result.current.lagrer).toBe(false)
    await waitFor(() => expect(result.current.kanSende).toBe(true))
  })

  it.each([
    ['legge til', true],
    ['fjerne', false],
  ])('viser feilmelding og beholder lagret valg når å %s bruker feiler', async (_, skalMotta) => {
    if (!skalMotta) mottakere.push(lagMottaker({ mottakertype: Mottakertype.BRUKER, fnr: brukerFnr }))
    feilVedEndring = true
    const { result } = await renderMottakervalg()

    await act(() => result.current.velgBruker(skalMotta))

    expect(showErrorToast).toHaveBeenCalledWith(feilmelding)
    expect(result.current.valgt).toBe(!skalMotta)
    expect(result.current.lagrer).toBe(false)
    await waitFor(() => expect(result.current.kanSende).toBe(true))
  })
})
