import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type BreveditorState } from '../breveditorTyper.ts'
import { useLagreBrev } from '../useLagreBrev.ts'

function brevState(tekst: string): BreveditorState {
  return {
    value: [{ type: 'p', children: [{ text: tekst }] }],
    valueAsHtml: `<p>${tekst}</p>`,
    history: { undos: [], redos: [] },
  }
}

describe('useLagreBrev', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('flushes the latest edits before the debounce timer expires', async () => {
    const lagre = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useLagreBrev(lagre))
    const sisteState = brevState('siste')
    act(() => {
      result.current.lagreMedDebounceOgRetry(brevState('første'), 1)
      result.current.lagreMedDebounceOgRetry(sisteState, 2)
    })
    expect(lagre).not.toHaveBeenCalled()
    await act(() => result.current.flushLagring())
    expect(lagre).toHaveBeenCalledExactlyOnceWith(sisteState, 2)
    expect(result.current.endringsstatus.erEndret).toBe(false)
    await act(() => vi.advanceTimersByTimeAsync(500))
    expect(lagre).toHaveBeenCalledTimes(1)
  })

  it('waits for an active save and then saves newer edits without overlapping requests', async () => {
    let fullfør!: () => void
    const lagre = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<void>((resolve) => {
            fullfør = resolve
          })
      )
      .mockResolvedValue(undefined)
    const { result } = renderHook(() => useLagreBrev(lagre))
    act(() => result.current.lagreMedDebounceOgRetry(brevState('første'), 1))
    await act(() => vi.advanceTimersByTimeAsync(500))
    act(() => result.current.lagreMedDebounceOgRetry(brevState('andre'), 2))
    let ferdig = false
    let flush!: Promise<void>
    act(() => {
      flush = result.current.flushLagring().then(() => {
        ferdig = true
      })
    })
    expect(ferdig).toBe(false)
    expect(lagre).toHaveBeenCalledTimes(1)
    await act(async () => {
      fullfør()
      await flush
    })
    expect(lagre).toHaveBeenCalledTimes(2)
    expect(lagre).toHaveBeenLastCalledWith(brevState('andre'), 2)
    expect(ferdig).toBe(true)
  })

  it('discards a conflicting save without rejecting or retrying', async () => {
    const lagre = vi.fn().mockRejectedValue(Object.assign(new Error('conflict'), { status: 409 }))
    const { result } = renderHook(() => useLagreBrev(lagre))
    act(() => result.current.lagreMedDebounceOgRetry(brevState('utdatert'), 1))
    await act(() => result.current.flushLagring())
    expect(result.current.endringsstatus).toEqual({ erEndret: false, lagrerNå: false, error: undefined })
    await act(() => vi.advanceTimersByTimeAsync(3000))
    expect(lagre).toHaveBeenCalledTimes(1)
  })

  it('allows flushing when an already active save returns a conflict', async () => {
    let avvis!: (error: Error) => void
    const lagre = vi.fn(
      () =>
        new Promise<void>((_resolve, reject) => {
          avvis = reject
        })
    )
    const { result } = renderHook(() => useLagreBrev(lagre))
    act(() => result.current.lagreMedDebounceOgRetry(brevState('utdatert'), 1))
    await act(() => vi.advanceTimersByTimeAsync(500))
    await act(async () => {
      const flush = result.current.flushLagring()
      avvis(Object.assign(new Error('conflict'), { status: 409 }))
      await flush
    })
    expect(result.current.endringsstatus).toEqual({ erEndret: false, lagrerNå: false, error: undefined })
    await act(() => vi.advanceTimersByTimeAsync(3000))
    expect(lagre).toHaveBeenCalledTimes(1)
  })

  it.each([403, 500])('rejects a failed flush (%s) and retains edits for another attempt', async (status) => {
    const error = Object.assign(new Error('save failed'), { status })
    const lagre = vi.fn().mockRejectedValueOnce(error).mockResolvedValue(undefined)
    const { result } = renderHook(() => useLagreBrev(lagre))
    const state = brevState('ulagret')
    act(() => result.current.lagreMedDebounceOgRetry(state, 1))
    await act(async () => {
      await expect(result.current.flushLagring()).rejects.toBe(error)
    })
    expect(result.current.endringsstatus.erEndret).toBe(true)
    expect(result.current.endringsstatus.error).toBeDefined()
    await act(() => result.current.flushLagring())
    expect(lagre).toHaveBeenLastCalledWith(state, 1)
    expect(result.current.endringsstatus.erEndret).toBe(false)
  })

  it('automatically retries failed saves', async () => {
    const lagre = vi.fn().mockRejectedValueOnce(new Error('save failed')).mockResolvedValue(undefined)
    const { result } = renderHook(() => useLagreBrev(lagre))
    act(() => result.current.lagreMedDebounceOgRetry(brevState('ulagret'), 1))
    await act(() => vi.advanceTimersByTimeAsync(500))
    expect(result.current.endringsstatus.erEndret).toBe(true)
    await act(() => vi.advanceTimersByTimeAsync(2000))
    expect(lagre).toHaveBeenCalledTimes(2)
    expect(result.current.endringsstatus.erEndret).toBe(false)
  })
})
