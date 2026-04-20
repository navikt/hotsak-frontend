import type { HarPersonnavn, Personnavn, Veiadresse } from '../types/hotlibs.ts'
import { isNumber, isPersonnavn, isString } from './type'

const beløpFormatter = new Intl.NumberFormat('nb', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function storForbokstavIOrd(ord?: string): string {
  if (!ord) return ''
  return ord.charAt(0).toUpperCase() + ord.slice(1).toLowerCase()
}

export function storForbokstavIAlleOrd(tekst?: string): string {
  if (!tekst) return ''
  return tekst
    .split(/([ -])/)
    .map(storForbokstavIOrd)
    .join('')
}

export function formaterKontonummer(kontonummer?: string): string {
  if (!kontonummer) return ''
  return `${kontonummer.slice(0, 4)}.${kontonummer.slice(4, 6)}.${kontonummer.slice(6)}`
}

export function formaterFødselsnummer(fødselsnummer?: string): string {
  if (fødselsnummer?.length !== 11) return ''
  return `${fødselsnummer.slice(0, 6)} ${fødselsnummer.slice(6)}`
}

export function formaterNavn(navn?: string | Personnavn | HarPersonnavn): string {
  if (!navn) return ''
  if (isString(navn)) return storForbokstavIAlleOrd(navn)
  if ((navn as HarPersonnavn).navn) {
    navn = (navn as HarPersonnavn).navn
  }
  if (!isPersonnavn(navn)) return ''
  return [navn.fornavn, navn.mellomnavn, navn.etternavn]
    .filter((value) => !!value)
    .map(storForbokstavIAlleOrd)
    .join(' ')
}

export function formaterTelefonnummer(telefon: string | undefined): string {
  if (!telefon) return ''
  return `${telefon.slice(0, 2)} ${telefon.slice(2, 4)} ${telefon.slice(4, 6)} ${telefon.slice(6)}`
}

export function formaterBeløp(verdi?: number | string): string {
  if (!verdi) {
    return ''
  } else {
    let value: string
    if (isNumber(verdi)) {
      value = beløpFormatter.format(verdi)
    } else {
      value = beløpFormatter.format(Number(verdi.replace(',', '.')))
    }
    if (value.endsWith(',00')) value = value.substring(0, value.length - 3)
    return value
  }
}

export function formaterAdresse(verdi?: Veiadresse): string {
  if (!verdi) return ''
  const { adresse, postnummer, poststed } = verdi
  return `${storForbokstavIAlleOrd(adresse)}, ${postnummer} ${storForbokstavIAlleOrd(poststed)}`
}

export function fjernMellomrom(verdi?: string): string {
  if (!verdi) return ''
  return verdi.replace(/\s+/g, '')
}
