import { describe, expect, test } from 'vitest'

import { unique } from './array.ts'

describe('array', () => {
  test('unique', () => {
    expect(unique([1, 1, 2, 2, 3, 3])).toEqual([1, 2, 3])
    expect(unique(['a', 'a', 'b', 'b', 'c', 'c'])).toEqual(['a', 'b', 'c'])
  })
})
