import { describe, expect, it } from 'vitest'

import { DataGridCollection } from '../DataGridCollection'

describe('DataGridCollection', () => {
  const items = [
    { id: 1, name: 'Alice', category: 'A' },
    { id: 2, name: 'Bob', category: 'B' },
    { id: 3, name: 'Charlie', category: 'A' },
    { id: 4, name: 'Diana', category: 'C' },
  ]

  describe('from', () => {
    it('oppretter samling fra array', () => {
      const collection = DataGridCollection.from(items)
      expect(collection.toArray()).toEqual(items)
    })

    it('oppretter tom samling fra null', () => {
      const collection = DataGridCollection.from(null)
      expect(collection.toArray()).toEqual([])
    })

    it('oppretter tom samling fra undefined', () => {
      const collection = DataGridCollection.from(undefined)
      expect(collection.toArray()).toEqual([])
    })
  })

  describe('filterBy', () => {
    it('filtrerer elementer etter selektor og filterverdier', () => {
      const collection = DataGridCollection.from(items)
      const filtered = collection.filterBy((item) => item.category, { values: new Set(['A']) })
      expect(filtered.toArray()).toEqual([
        { id: 1, name: 'Alice', category: 'A' },
        { id: 3, name: 'Charlie', category: 'A' },
      ])
    })

    it('returnerer alle elementer når filter er undefined', () => {
      const collection = DataGridCollection.from(items)
      const filtered = collection.filterBy((item) => item.category, undefined)
      expect(filtered.toArray()).toEqual(items)
    })

    it('returnerer alle elementer når filterverdier er tomt sett', () => {
      const collection = DataGridCollection.from(items)
      const filtered = collection.filterBy((item) => item.category, { values: new Set<string>() })
      expect(filtered.toArray()).toEqual(items)
    })

    it('støtter kjeding av flere filtre', () => {
      const collection = DataGridCollection.from(items)
      const filtered = collection
        .filterBy((item) => item.category, { values: new Set(['A', 'B']) })
        .filterBy((item) => item.name, { values: new Set(['Alice']) })
      expect(filtered.toArray()).toEqual([{ id: 1, name: 'Alice', category: 'A' }])
    })
  })

  describe('toSorted', () => {
    it('sorterer elementer med komparator', () => {
      const collection = DataGridCollection.from(items)
      const sorted = collection.toSorted((a, b) => b.id - a.id)
      expect(sorted.toArray().map((i) => i.id)).toEqual([4, 3, 2, 1])
    })

    it('returnerer samme samling når komparator er undefined', () => {
      const collection = DataGridCollection.from(items)
      const sorted = collection.toSorted(undefined)
      expect(sorted.toArray()).toEqual(items)
    })

    it('muterer ikke original samling', () => {
      const collection = DataGridCollection.from(items)
      collection.toSorted((a, b) => b.id - a.id)
      expect(collection.toArray()).toEqual(items)
    })
  })
})
