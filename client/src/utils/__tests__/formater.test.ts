import { describe, expect, it } from 'vitest'

import {
  fjernMellomrom,
  formaterAdresse,
  formaterBeløp,
  formaterFødselsnummer,
  formaterKontonummer,
  formaterNavn,
  formaterTelefonnummer,
  storForbokstavIAlleOrd,
  storForbokstavIOrd,
} from '../formater'

describe('formater', () => {
  describe('storForbokstavIOrd', () => {
    it('gjør første bokstav stor og resten små', () => {
      expect(storForbokstavIOrd('KRISTIANSAND')).toBe('Kristiansand')
    })

    it('behandler flerords-input som ett ord', () => {
      expect(storForbokstavIOrd('KRISTIANSAND S')).toBe('Kristiansand s')
    })

    it('returnerer tom streng for undefined', () => {
      expect(storForbokstavIOrd(undefined)).toBe('')
    })
  })

  describe('storForbokstavIAlleOrd', () => {
    it('gjør første bokstav stor i hvert mellomromseparert ord', () => {
      expect(storForbokstavIAlleOrd('KRISTIANSAND S')).toBe('Kristiansand S')
    })

    it('gjør første bokstav stor i hvert bindestrekseparert ord', () => {
      expect(storForbokstavIAlleOrd('KRISTIANSAND-S')).toBe('Kristiansand-S')
    })

    it('håndterer blandede separatorer', () => {
      expect(storForbokstavIAlleOrd('INN SEN-DER')).toBe('Inn Sen-Der')
    })

    it('returnerer tom streng for undefined', () => {
      expect(storForbokstavIAlleOrd(undefined)).toBe('')
    })
  })

  describe('formaterKontonummer', () => {
    it('formaterer kontonummer med punktum', () => {
      expect(formaterKontonummer('12345678901')).toBe('1234.56.78901')
    })

    it('returnerer tom streng for undefined', () => {
      expect(formaterKontonummer(undefined)).toBe('')
    })

    it('returnerer tom streng for tom streng', () => {
      expect(formaterKontonummer('')).toBe('')
    })
  })

  describe('formaterFødselsnummer', () => {
    it('formaterer 11-sifret fødselsnummer med mellomrom', () => {
      expect(formaterFødselsnummer('12345678901')).toBe('123456 78901')
    })

    it('returnerer tom streng for feil lengde', () => {
      expect(formaterFødselsnummer('123')).toBe('')
    })

    it('returnerer tom streng for undefined', () => {
      expect(formaterFødselsnummer(undefined)).toBe('')
    })
  })

  describe('formaterNavn', () => {
    it('formaterer strengnavn med stor forbokstav', () => {
      expect(formaterNavn('OLA NORDMANN')).toBe('Ola Nordmann')
    })

    it('formaterer Personnavn-objekt', () => {
      expect(formaterNavn({ fornavn: 'OLA', mellomnavn: undefined, etternavn: 'NORDMANN' })).toBe('Ola Nordmann')
    })

    it('formaterer Personnavn med mellomnavn', () => {
      expect(formaterNavn({ fornavn: 'OLA', mellomnavn: 'MELLOM', etternavn: 'NORDMANN' })).toBe('Ola Mellom Nordmann')
    })

    it('formaterer HarPersonnavn-objekt', () => {
      expect(formaterNavn({ navn: { fornavn: 'KARI', etternavn: 'HANSEN' } })).toBe('Kari Hansen')
    })

    it('returnerer tom streng for undefined', () => {
      expect(formaterNavn(undefined)).toBe('')
    })

    it('returnerer tom streng for tom streng', () => {
      expect(formaterNavn('')).toBe('')
    })
  })

  describe('formaterTelefonnummer', () => {
    it('formaterer 8-sifret telefonnummer med mellomrom', () => {
      expect(formaterTelefonnummer('12345678')).toBe('12 34 56 78')
    })

    it('returnerer tom streng for undefined', () => {
      expect(formaterTelefonnummer(undefined)).toBe('')
    })
  })

  describe('formaterBeløp', () => {
    it('formaterer tall som norsk valuta', () => {
      expect(formaterBeløp(1234.56)).toMatch(/1[\s\u00a0]234,56/)
    })

    it('fjerner etterfølgende ,00', () => {
      expect(formaterBeløp(1000)).toMatch(/1[\s\u00a0]000$/)
    })

    it('formaterer strenginput', () => {
      expect(formaterBeløp('1234,56')).toMatch(/1[\s\u00a0]234,56/)
    })

    it('returnerer tom streng for undefined', () => {
      expect(formaterBeløp(undefined)).toBe('')
    })

    it('returnerer tom streng for 0', () => {
      expect(formaterBeløp(0)).toBe('')
    })
  })

  describe('formaterAdresse', () => {
    it('formaterer veiadresse', () => {
      expect(
        formaterAdresse({
          adresse: 'STORGATA 1',
          postnummer: '0182',
          poststed: 'OSLO',
        })
      ).toBe('Storgata 1, 0182 Oslo')
    })

    it('returnerer tom streng for undefined', () => {
      expect(formaterAdresse(undefined)).toBe('')
    })
  })

  describe('fjernMellomrom', () => {
    it('fjerner alle mellomrom', () => {
      expect(fjernMellomrom('hello world')).toBe('helloworld')
    })

    it('fjerner flere mellomrom og tabulatorer', () => {
      expect(fjernMellomrom('  a  b\tc  ')).toBe('abc')
    })

    it('returnerer tom streng for undefined', () => {
      expect(fjernMellomrom(undefined)).toBe('')
    })
  })
})
