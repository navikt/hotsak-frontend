import { describe, expect, it } from 'vitest'

import { toError } from '../error'

describe('toError', () => {
  it('returns same instance when input is already an Error', () => {
    const original = new Error('boom')

    expect(toError(original)).toBe(original)
  })

  it('creates an Error from string input', () => {
    const error = toError('feilmelding')

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('feilmelding')
  })

  it('creates an Error with cause for unknown input', () => {
    const cause = { status: 500, detail: 'backend' }
    const error = toError(cause)

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Error')
    expect(error.cause).toEqual(cause)
  })
})
