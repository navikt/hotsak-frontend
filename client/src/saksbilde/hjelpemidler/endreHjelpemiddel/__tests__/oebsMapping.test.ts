import { describe, expect, it } from 'vitest'

import type { AlternativeProduct } from '../../useAlternativeProdukter'
import { finnGjeldendeOebsEnhet } from '../oebsMapping'

function toAlternativeProduct(value: unknown): AlternativeProduct {
  return value as AlternativeProduct
}

describe('oebsMapping', () => {
  describe('finnGjeldendeOebsEnhet', () => {
    it('returnerer oebsEnhet for kjent enhetsnummer', () => {
      const result = finnGjeldendeOebsEnhet('4703')
      expect(result.oebsEnhet).toBeDefined()
      expect(result.oebsEnhet?.navn).toBe('Nav hjelpemiddelsentral Oslo')
      expect(result.lagerlokasjoner).toContain('oslo')
    })

    it('returnerer tomme lagerlokasjoner for ukjent enhetsnummer', () => {
      const result = finnGjeldendeOebsEnhet('9999')
      expect(result.oebsEnhet).toBeUndefined()
      expect(result.lagerlokasjoner).toEqual([])
    })

    it('håndterer enhet med flere lagerlokasjoner (Troms og Finnmark)', () => {
      const result = finnGjeldendeOebsEnhet('4719')
      expect(result.lagerlokasjoner).toHaveLength(2)
      expect(result.lagerlokasjoner).toContain('troms')
      expect(result.lagerlokasjoner).toContain('finnmark')
    })

    describe('grupperPåHmsArtNr', () => {
      it('grupperer produkter etter hmsArtNr og filtrerer lagerbeholdning', () => {
        const result = finnGjeldendeOebsEnhet('4703') // Oslo
        const produkter = [
          {
            hmsArtNr: '111',
            alternativeFor: ['AAA'],
            wareHouseStock: [
              { location: 'Oslo', amountInStock: 5 },
              { location: 'Bergen', amountInStock: 10 },
            ],
          },
        ].map(toAlternativeProduct)
        const grouped = result.grupperPåHmsArtNr(produkter)
        expect(grouped['AAA']).toHaveLength(1)
        // Skal kun inkludere Oslo-beholdning
        expect(grouped['AAA'][0].wareHouseStock).toHaveLength(1)
        expect(grouped['AAA']?.[0]?.wareHouseStock?.[0]?.location).toBe('Oslo')
      })

      it('mapper produkt til flere hmsArtNr-nøkler', () => {
        const result = finnGjeldendeOebsEnhet('4703')
        const produkter = [
          {
            hmsArtNr: '111',
            alternativeFor: ['AAA', 'BBB'],
            wareHouseStock: [],
          },
        ].map(toAlternativeProduct)
        const grouped = result.grupperPåHmsArtNr(produkter)
        expect(grouped['AAA']).toHaveLength(1)
        expect(grouped['BBB']).toHaveLength(1)
      })
    })

    describe('harProduktPåLager', () => {
      it('returnerer true når produkt har beholdning på enhetens lokasjon', () => {
        const result = finnGjeldendeOebsEnhet('4703')
        const produkt = toAlternativeProduct({
          wareHouseStock: [{ location: 'Oslo', amountInStock: 5 }],
        })
        expect(result.harProduktPåLager(produkt)).toBe(true)
      })

      it('returnerer false når produkt ikke har beholdning på enhetens lokasjon', () => {
        const result = finnGjeldendeOebsEnhet('4703')
        const produkt = toAlternativeProduct({
          wareHouseStock: [{ location: 'Bergen', amountInStock: 5 }],
        })
        expect(result.harProduktPåLager(produkt)).toBe(false)
      })

      it('returnerer false når produkt har null på lager', () => {
        const result = finnGjeldendeOebsEnhet('4703')
        const produkt = toAlternativeProduct({
          wareHouseStock: [{ location: 'Oslo', amountInStock: 0 }],
        })
        expect(result.harProduktPåLager(produkt)).toBe(false)
      })

      it('returnerer false når wareHouseStock er tom', () => {
        const result = finnGjeldendeOebsEnhet('4703')
        const produkt = toAlternativeProduct({ wareHouseStock: [] })
        expect(result.harProduktPåLager(produkt)).toBe(false)
      })

      it('returnerer false når wareHouseStock er null', () => {
        const result = finnGjeldendeOebsEnhet('4703')
        const produkt = toAlternativeProduct({ wareHouseStock: null })
        expect(result.harProduktPåLager(produkt)).toBe(false)
      })
    })
  })
})
