import { describe, expect, it } from 'vitest'

import {
  assertNever,
  isError,
  isFunction,
  isInteger,
  isKeyOfObject,
  isNotBlank,
  isNumber,
  isPersonnavn,
  isString,
} from '../type'

describe('type utils', () => {
  describe('isNumber', () => {
    it('returns true for finite numbers', () => {
      expect(isNumber(42)).toBe(true)
    })

    it('returns false for non-finite or non-number values', () => {
      expect(isNumber(Number.POSITIVE_INFINITY)).toBe(false)
      expect(isNumber(Number.NaN)).toBe(false)
      expect(isNumber('42')).toBe(false)
    })
  })

  describe('isInteger', () => {
    it('returns true for integer numbers and integer-like strings', () => {
      expect(isInteger(12)).toBe(true)
      expect(isInteger('12')).toBe(true)
    })

    it('returns false for null, empty and non-integer values', () => {
      expect(isInteger(null)).toBe(false)
      expect(isInteger('')).toBe(false)
      expect(isInteger('12.5')).toBe(false)
      expect(isInteger(12.5)).toBe(false)
    })
  })

  describe('isString', () => {
    it('returns true for primitive and String object values', () => {
      expect(isString('tekst')).toBe(true)
      expect(isString(new String('tekst'))).toBe(true)
    })

    it('returns false for non-string values', () => {
      expect(isString(1)).toBe(false)
      expect(isString(undefined)).toBe(false)
    })
  })

  describe('isFunction', () => {
    it('returns true for functions', () => {
      expect(isFunction(() => {})).toBe(true)
    })

    it('returns false for non-functions', () => {
      expect(isFunction({})).toBe(false)
    })
  })

  describe('isError', () => {
    it('returns true for Error instances', () => {
      expect(isError(new Error('boom'))).toBe(true)
    })

    it('returns true for error-like objects with name and message', () => {
      expect(isError({ name: 'TypeError', message: 'bad' })).toBe(true)
    })

    it('returns false for values without valid error fields', () => {
      expect(isError({ name: 'TypeError', message: 123 })).toBe(false)
      expect(isError(null)).toBe(false)
    })
  })

  describe('isPersonnavn', () => {
    it('returns true for object containing fornavn and etternavn as strings', () => {
      expect(isPersonnavn({ fornavn: 'Ola', etternavn: 'Nordmann' })).toBe(true)
    })

    it('returns false when required fields are missing or invalid', () => {
      expect(isPersonnavn({ fornavn: 'Ola' })).toBe(false)
      expect(isPersonnavn({ fornavn: 'Ola', etternavn: 1 })).toBe(false)
    })
  })

  describe('isNotBlank', () => {
    it('returns true for non-empty trimmed strings', () => {
      expect(isNotBlank(' abc ')).toBe(true)
    })

    it('returns false for blank or non-string values', () => {
      expect(isNotBlank('   ')).toBe(false)
      expect(isNotBlank(undefined)).toBe(false)
    })
  })

  describe('isKeyOfObject', () => {
    it('returns true when key exists in object', () => {
      expect(isKeyOfObject('navn', { navn: 'Kari' })).toBe(true)
    })

    it('returns false when key does not exist in object', () => {
      expect(isKeyOfObject('alder', { navn: 'Kari' })).toBe(false)
    })
  })

  describe('assertNever', () => {
    it('throws with descriptive message', () => {
      expect(() => assertNever('ukjent' as never)).toThrow('Uhåndtert verdi: ukjent')
    })
  })
})
