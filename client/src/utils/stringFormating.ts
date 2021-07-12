export const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1)

export const capitalizeName = (value: string) =>
  value
    .toLowerCase()
    .split(' ')
    .map((value) => capitalize(value))
    .join(' ')
