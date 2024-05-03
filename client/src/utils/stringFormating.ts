import type { Adresse, Navn } from '../types/types.internal'
import { isNavn, isNumber, isString } from './type'

const beløpFormatter = new Intl.NumberFormat('nb', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function capitalizeMedSkilletegn(value: string, separator: string): string {
  return value
    .split(separator)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(separator)
}

export function capitalize(value?: string): string {
  if (!value) return ''
  else return value.charAt(0).toUpperCase() + value.toLowerCase().slice(1)
}

export function capitalizeName(value: string | Navn): string {
  const lowercaseValue = formatName(value).toLowerCase()
  const storBokstavEtterBindestrek = capitalizeMedSkilletegn(lowercaseValue, '-')
  return capitalizeMedSkilletegn(storBokstavEtterBindestrek, ' ')
}

export function formaterKontonummer(kontonummer?: string): string {
  return kontonummer ? `${kontonummer?.slice(0, 4)}.${kontonummer?.slice(4, 6)}.${kontonummer?.slice(6)}` : ''
}

export function formaterFødselsnummer(fødselsnummer: string): string {
  return `${fødselsnummer.slice(0, 6)} ${fødselsnummer.slice(6)}`
}

export function formatName(navn: string | Navn): string {
  if (isString(navn)) return navn
  if (!isNavn(navn)) return ''
  const fulltNavn = [navn.fornavn, navn.mellomnavn, navn.etternavn].filter((value) => !!value).join(' ')
  return capitalizeName(fulltNavn)
}

export function formaterTelefonnummer(telefon: string): string {
  const siffer = telefon.split('')
  return `${siffer.slice(0, 2).join('')} ${siffer.slice(2, 4).join('')} ${siffer.slice(4, 6).join('')} ${siffer
    .slice(6, siffer.length)
    .join('')}`
}

export function formaterBeløp(verdi?: number | string): string {
  if (!verdi) {
    return ''
  } else {
    let value = ''
    if (isNumber(verdi)) {
      value = beløpFormatter.format(verdi)
    } else {
      value = beløpFormatter.format(Number(verdi.replace(',', '.')))
    }
    if (value.endsWith(',00')) value = value.substring(0, value.length - 3)
    return value
  }
}

export function formaterAdresse(verdi?: Adresse): string {
  if (!verdi) return ''
  const { adresse, postnummer, poststed } = verdi
  return `${capitalize(adresse)}, ${postnummer} ${capitalize(poststed)}`
}
