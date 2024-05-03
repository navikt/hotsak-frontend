import { describe, expect, test } from 'vitest'
import { storForbokstavIAlleOrd, storForbokstavIOrd } from './formater'

describe('formater', () => {
  test('storForbokstavIOrd', () => {
    let ord = storForbokstavIOrd('KRISTIANSAND')
    expect(ord).toBe('Kristiansand')

    ord = storForbokstavIOrd('KRISTIANSAND S')
    expect(ord).toBe('Kristiansand s')
  })
  test('storForbokstavIAlleOrd', () => {
    let tekst = storForbokstavIAlleOrd('KRISTIANSAND S')
    expect(tekst).toBe('Kristiansand S')

    tekst = storForbokstavIAlleOrd('KRISTIANSAND-S')
    expect(tekst).toBe('Kristiansand-S')

    tekst = storForbokstavIAlleOrd('BRU K. ER')
    expect(tekst).toBe('Bru K. Er')

    tekst = storForbokstavIAlleOrd('INN SEN-DER')
    expect(tekst).toBe('Inn Sen-Der')
  })
})
