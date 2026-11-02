import { cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Oppgavetype } from './oppgaveTypes.ts'
import { useSkyraOppgavetype } from './useSkyraOppgavetype.ts'

describe('useSkyraOppgavetype', () => {
  const setTraits = vi.fn()

  beforeEach(() => {
    setTraits.mockClear()
    vi.stubGlobal('skyra', { setTraits })
    vi.stubGlobal('SKYRA_CONFIG', {
      org: 'arbeids-og-velferdsetaten-nav',
      traits: { 'annen-trait': 'beholdes' },
    })
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it.each(Object.values(Oppgavetype))('sender oppgavetypen %s til Skyra', (oppgavetype) => {
    renderHook(() => useSkyraOppgavetype(oppgavetype))

    expect(setTraits).toHaveBeenLastCalledWith({ 'hotsak-oppgavetype': oppgavetype })
    expect(window.SKYRA_CONFIG?.traits).toEqual({
      'annen-trait': 'beholdes',
      'hotsak-oppgavetype': oppgavetype,
    })
  })

  it('oppdaterer traiten ved bytte fra journalføring til saksbehandling', () => {
    const { rerender } = renderHook(({ oppgavetype }) => useSkyraOppgavetype(oppgavetype), {
      initialProps: { oppgavetype: Oppgavetype.JOURNALFØRING },
    })

    rerender({ oppgavetype: Oppgavetype.BEHANDLE_SAK })

    expect(setTraits).toHaveBeenLastCalledWith({ 'hotsak-oppgavetype': Oppgavetype.BEHANDLE_SAK })
    expect(window.SKYRA_CONFIG?.traits?.['hotsak-oppgavetype']).toBe(Oppgavetype.BEHANDLE_SAK)
  })

  it('tømmer traiten når brukeren forlater oppgaven', () => {
    const { unmount } = renderHook(() => useSkyraOppgavetype(Oppgavetype.JOURNALFØRING))

    unmount()

    expect(setTraits).toHaveBeenLastCalledWith({ 'hotsak-oppgavetype': '' })
    expect(window.SKYRA_CONFIG?.traits).toEqual({
      'annen-trait': 'beholdes',
      'hotsak-oppgavetype': '',
    })
  })
})
