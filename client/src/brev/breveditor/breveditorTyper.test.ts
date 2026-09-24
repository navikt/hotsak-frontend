import { describe, expect, it } from 'vitest'

import { type BreveditorBrevdata, isBreveditorState } from './breveditorTyper.ts'

describe('isBreveditorState', () => {
  it('avviser initialiseringsdata', () => {
    const data: BreveditorBrevdata = {
      templateValues: { auto_antall_uker_svartid: '12 uker' },
    }

    expect(isBreveditorState(data)).toBe(false)
  })

  it('gjenkjenner lagret editortilstand', () => {
    const data: BreveditorBrevdata = {
      value: [{ type: 'p', children: [{ text: 'Hei' }] }],
      valueAsHtml: '<p>Hei</p>',
      history: { undos: [], redos: [] },
    }

    expect(isBreveditorState(data)).toBe(true)
  })
})
