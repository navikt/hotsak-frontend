import { describe, expect, it } from 'vitest'

import {
  beregnAlder,
  formaterDato,
  formaterDatoKort,
  formaterDatoLang,
  formaterRelativTid,
  formaterTidsstempel,
  formaterTidsstempelKort,
  formaterTidsstempelLang,
  intervalString,
  sorterKronologiskStigende,
  sorterKronologiskSynkende,
  tilDato,
  tilLocalDateString,
} from '../dato'

describe('dato', () => {
  describe('formaterDato', () => {
    it('formaterer en datostreng', () => {
      expect(formaterDato('2024-01-15')).toMatch(/15\.01\.2024/)
    })

    it('returnerer tom streng for undefined', () => {
      expect(formaterDato(undefined)).toBe('')
    })
  })

  describe('formaterDatoKort', () => {
    it('formaterer dato som dd.MM.yy', () => {
      expect(formaterDatoKort('2024-03-05')).toBe('05.03.24')
    })

    it('returnerer tom streng for undefined', () => {
      expect(formaterDatoKort(undefined)).toBe('')
    })
  })

  describe('formaterDatoLang', () => {
    it('formaterer dato i langt norsk format', () => {
      const result = formaterDatoLang('2024-01-15')
      expect(result).toMatch(/15\. januar 2024/)
    })

    it('returnerer tom streng for undefined', () => {
      expect(formaterDatoLang(undefined)).toBe('')
    })
  })

  describe('formaterTidsstempel', () => {
    it('formaterer ISO-tidsstempel', () => {
      const result = formaterTidsstempel('2024-01-15T10:30:00Z')
      expect(result).toMatch(/15\.01\.2024/)
    })

    it('legger til Z hvis den mangler', () => {
      const result = formaterTidsstempel('2024-01-15T10:30:00')
      expect(result).toMatch(/15\.01\.2024/)
    })

    it('returnerer tom streng for undefined', () => {
      expect(formaterTidsstempel(undefined)).toBe('')
    })
  })

  describe('formaterTidsstempelLang', () => {
    it('formaterer med kl.-notasjon', () => {
      const result = formaterTidsstempelLang('2024-01-15T10:30:00Z')
      expect(result).toMatch(/15\.01\.2024 kl\./)
    })

    it('returnerer tom streng for undefined', () => {
      expect(formaterTidsstempelLang(undefined)).toBe('')
    })
  })

  describe('formaterTidsstempelKort', () => {
    it('returnerer tom streng for undefined', () => {
      expect(formaterTidsstempelKort(undefined)).toBe('')
    })

    it('formaterer kort tidsstempel', () => {
      const result = formaterTidsstempelKort('2024-01-15T10:30:00Z')
      expect(result).toMatch(/15\.01 kl\./)
    })
  })

  describe('formaterRelativTid', () => {
    it('returnerer tom streng for undefined', () => {
      expect(formaterRelativTid(undefined)).toBe('')
    })
  })

  describe('tilDato', () => {
    it('konverterer streng til Date', () => {
      const result = tilDato('2024-01-15')
      expect(result).toBeInstanceOf(Date)
    })

    it('returnerer undefined for undefined', () => {
      expect(tilDato(undefined)).toBeUndefined()
    })
  })

  describe('tilLocalDateString', () => {
    it('returnerer ISO-datostreng', () => {
      const result = tilLocalDateString(new Date(2024, 0, 15))
      expect(result).toBe('2024-01-15')
    })
  })

  describe('sorterKronologiskStigende', () => {
    it('sorterer datoer stigende', () => {
      expect(sorterKronologiskStigende('2024-01-01', '2024-01-02')).toBeLessThan(0)
      expect(sorterKronologiskStigende('2024-01-02', '2024-01-01')).toBeGreaterThan(0)
      expect(sorterKronologiskStigende('2024-01-01', '2024-01-01')).toBe(0)
    })
  })

  describe('sorterKronologiskSynkende', () => {
    it('sorterer datoer synkende', () => {
      expect(sorterKronologiskSynkende('2024-01-01', '2024-01-02')).toBeGreaterThan(0)
      expect(sorterKronologiskSynkende('2024-01-02', '2024-01-01')).toBeLessThan(0)
    })
  })

  describe('beregnAlder', () => {
    it('beregner alder fra fødselsdato', () => {
      const tenYearsAgo = new Date()
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10)
      expect(beregnAlder(tenYearsAgo)).toBe(10)
    })
  })

  describe('intervalString', () => {
    it('lager intervall fra to datoer', () => {
      const fra = new Date('2024-01-01T00:00:00Z')
      const til = new Date('2024-01-15T00:00:00Z')
      const result = intervalString(fra, til)
      expect(result).toContain('/')
      expect(result).toMatch(/2024-01-01/)
      expect(result).toMatch(/2024-01-15/)
    })

    it('lager intervall fra varighet og dato', () => {
      const duration = { days: 10 }
      const til = new Date('2024-01-15T00:00:00Z')
      const result = intervalString(duration, til)
      expect(result).toMatch(/P.*10D/)
      expect(result).toMatch(/2024-01-15/)
    })

    it('lager intervall fra strenger', () => {
      const result = intervalString('2024-01-01', '2024-01-15')
      expect(result).toBe('2024-01-01/2024-01-15')
    })
  })
})
