export const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.toLowerCase().slice(1)

export const capitalizeName = (value: string) =>
  value
    .toLowerCase()
    .split(' ')
    .map((value) => capitalize(value))
    .join(' ')

export const formaterFødselsnummer = (fødselsnummer: string) => {
  return `${fødselsnummer.slice(0, 6)} ${fødselsnummer.slice(6)}`
}
