import { describe, expect, it, vi } from 'vitest'

import { delay } from '../delay'

describe('delay', () => {
  it('resolves after provided timeout', async () => {
    vi.useFakeTimers()

    let resolved = false
    const promise = delay(200).then(() => {
      resolved = true
    })

    await vi.advanceTimersByTimeAsync(199)
    expect(resolved).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    await promise
    expect(resolved).toBe(true)

    vi.useRealTimers()
  })
})
