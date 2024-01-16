import { Navn } from '../types/types.internal'

export const capitalize = (value?: string): string => {
  if (!value) {
    return ''
  } else return value.charAt(0).toUpperCase() + value.toLowerCase().slice(1)
}

export const capitalizeName = (value: string) => {
  const lowercaseValue = value.toLowerCase()

  const storBokstavEtterBindestrek = capitalizeMedSkilletegn(lowercaseValue, '-')
  return capitalizeMedSkilletegn(storBokstavEtterBindestrek, ' ')
}

function capitalizeMedSkilletegn(value: string, skilletegn: string) {
  return value
    .split(skilletegn)
    .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
    .join(skilletegn)
}
export const formaterKontonummer = (kontonummer?: string) => {
  return kontonummer ? `${kontonummer?.slice(0, 4)}.${kontonummer?.slice(4, 6)}.${kontonummer?.slice(6)}` : ''
}

export const formaterFødselsnummer = (fødselsnummer: string) => {
  return `${fødselsnummer.slice(0, 6)} ${fødselsnummer.slice(6)}`
}

export const formatName = (navn: Navn) => {
  const { fornavn, mellomnavn, etternavn } = navn
  return capitalizeName(`${fornavn} ${mellomnavn ? `${mellomnavn} ` : ''} ${etternavn}`)
}

export const formaterTelefonnummer = (telefon: string) => {
  const siffer = telefon.split('')

  return `${siffer.slice(0, 2).join('')} ${siffer.slice(2, 4).join('')} ${siffer.slice(4, 6).join('')} ${siffer
    .slice(6, siffer.length)
    .join('')}`
}
