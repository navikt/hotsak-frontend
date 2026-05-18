import { describe, expect, it } from 'vitest'

import {
  associateBy,
  compareBy,
  comparator,
  directionalComparator,
  groupBy,
  hasAny,
  natural,
  naturalBy,
  notEmpty,
  reverseComparator,
  unique,
  uniqueBy,
} from '../array'

describe('array', () => {
  describe('unique', () => {
    it('fjerner duplikater', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
    })

    it('håndterer tom array', () => {
      expect(unique([])).toEqual([])
    })
  })

  describe('uniqueBy', () => {
    it('henter unike verdier etter selektor', () => {
      const items = [
        { id: 1, type: 'A' },
        { id: 2, type: 'B' },
        { id: 3, type: 'A' },
      ]
      expect(uniqueBy(items, (i) => i.type)).toEqual(['A', 'B'])
    })
  })

  describe('groupBy', () => {
    it('grupperer elementer etter nøkkel', () => {
      const items = [
        { id: 1, type: 'A' },
        { id: 2, type: 'B' },
        { id: 3, type: 'A' },
      ]
      const result = groupBy(items, (i) => i.type)
      expect(result['A']).toHaveLength(2)
      expect(result['B']).toHaveLength(1)
    })
  })

  describe('associateBy', () => {
    it('lager record etter nøkkel, beholder første verdi', () => {
      const items = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]
      const result = associateBy(items, (i) => i.id)
      expect(result[1]).toEqual({ id: 1, name: 'Alice' })
      expect(result[2]).toEqual({ id: 2, name: 'Bob' })
    })
  })

  describe('notEmpty', () => {
    it('returnerer true for verdier', () => {
      expect(notEmpty(0)).toBe(true)
      expect(notEmpty('')).toBe(true)
      expect(notEmpty('hello')).toBe(true)
    })

    it('returnerer false for null/undefined', () => {
      expect(notEmpty(null)).toBe(false)
      expect(notEmpty(undefined)).toBe(false)
    })
  })

  describe('natural', () => {
    it('sammenligner strenger naturlig', () => {
      expect(natural('a', 'b')).toBeLessThan(0)
      expect(natural('b', 'a')).toBeGreaterThan(0)
      expect(natural('a', 'a')).toBe(0)
    })

    it('håndterer numeriske strenger', () => {
      expect(natural('2', '10')).toBeLessThan(0)
    })

    it('håndterer undefined-verdier', () => {
      expect(natural(undefined, 'a')).toBeLessThan(0)
      expect(natural('a', undefined)).toBeGreaterThan(0)
      expect(natural(undefined, undefined)).toBe(0)
    })
  })

  describe('naturalBy', () => {
    it('sorterer etter selektor med naturlig rekkefølge', () => {
      const items = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }]
      const sorted = items.toSorted(naturalBy((i) => i.name))
      expect(sorted.map((i) => i.name)).toEqual(['Alice', 'Bob', 'Charlie'])
    })
  })

  describe('reverseComparator', () => {
    it('reverserer sorteringsrekkefølgen', () => {
      const cmp = (a: number, b: number) => a - b
      const reversed = reverseComparator(cmp)
      expect(reversed(1, 2)).toBeGreaterThan(0)
      expect(reversed(2, 1)).toBeLessThan(0)
    })
  })

  describe('directionalComparator', () => {
    const cmp = (a: number, b: number) => a - b

    it('ascending beholder rekkefølgen', () => {
      expect(directionalComparator('ascending', cmp)(1, 2)).toBeLessThan(0)
    })

    it('descending reverserer rekkefølgen', () => {
      expect(directionalComparator('descending', cmp)(1, 2)).toBeGreaterThan(0)
    })

    it('DESC reverserer rekkefølgen', () => {
      expect(directionalComparator('DESC', cmp)(1, 2)).toBeGreaterThan(0)
    })

    it('none returnerer 0', () => {
      expect(directionalComparator('none', cmp)(1, 2)).toBe(0)
    })
  })

  describe('comparator', () => {
    it('sammenligner med selektor og indre komparator', () => {
      type Item = { value: number | null }
      const cmp = comparator<Item, number>(
        'ascending',
        (i) => i.value,
        (a, b) => a - b
      )
      expect(cmp({ value: 1 }, { value: 2 })).toBeLessThan(0)
    })

    it('plasserer null-verdier sist', () => {
      type Item = { value: number | null }
      const cmp = comparator<Item, number>(
        'ascending',
        (i) => i.value,
        (a, b) => a - b
      )
      expect(cmp({ value: null }, { value: 1 })).toBe(1)
      expect(cmp({ value: 1 }, { value: null })).toBe(-1)
    })

    it('behandler begge null som like', () => {
      type Item = { value: number | null }
      const cmp = comparator<Item, number>(
        'ascending',
        (i) => i.value,
        (a, b) => a - b
      )
      expect(cmp({ value: null }, { value: null })).toBe(0)
    })
  })

  describe('compareBy', () => {
    it('sammenligner etter selektor med lokalitetssensitiv sortering', () => {
      type Item = { name: string }
      const cmp = compareBy<Item>('ascending', (i) => i.name)
      const sorted = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }].toSorted(cmp)
      expect(sorted.map((i) => i.name)).toEqual(['Alice', 'Bob', 'Charlie'])
    })

    it('håndterer numeriske verdier', () => {
      type Item = { num: number }
      const cmp = compareBy<Item>('ascending', (i) => i.num)
      const sorted = [{ num: 10 }, { num: 2 }, { num: 1 }].toSorted(cmp)
      expect(sorted.map((i) => i.num)).toEqual([1, 2, 10])
    })
  })

  describe('hasAny', () => {
    it('returnerer true hvis settet inneholder noen av verdiene', () => {
      const set = new Set([1, 2, 3])
      expect(hasAny(set, [2, 4])).toBe(true)
    })

    it('returnerer false hvis settet ikke inneholder noen av verdiene', () => {
      const set = new Set([1, 2, 3])
      expect(hasAny(set, [4, 5])).toBe(false)
    })

    it('returnerer false for tom verdiliste', () => {
      const set = new Set([1, 2, 3])
      expect(hasAny(set, [])).toBe(false)
    })
  })
})
