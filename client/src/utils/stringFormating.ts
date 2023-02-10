export const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.toLowerCase().slice(1)

export const capitalizeName = (value: string) =>
  value
    .toLowerCase()
    .split(' ')
    .map((value) => capitalize(value))
    .join(' ')

export const formaterKontonummer = (kontonummer?: string) => {
  return kontonummer ? `${kontonummer?.slice(0, 4)}.${kontonummer?.slice(4, 6)}.${kontonummer?.slice(6)}` : ''
}

export const formaterFødselsnummer = (fødselsnummer: string) => {
  return `${fødselsnummer.slice(0, 6)} ${fødselsnummer.slice(6)}`
}

export const formaterTelefonnummer = (telefon: string) => {
  const siffer = telefon.split('')

  return `${siffer.slice(0, 2).join('')} ${siffer.slice(2, 4).join('')} ${siffer.slice(4, 6).join('')} ${siffer
    .slice(6, siffer.length)
    .join('')}`
}
