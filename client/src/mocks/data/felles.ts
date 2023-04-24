import dayjs, { Dayjs } from 'dayjs'

export function tilfeldigInnslag<T>(array: T[]): T {
  return array[lagTilfeldigInteger(0, array.length - 1)]
}

export function lagUUID(): string {
  return crypto.randomUUID()
}

export function lagTilfeldigInteger(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function lagTilfeldigDato(år: number): Dayjs {
  const d = dayjs(new Date(år, lagTilfeldigInteger(0, 11), 1))
  const day = lagTilfeldigInteger(1, d.daysInMonth())
  return d.set('day', day)
}

export function lagTilfeldigFødselsdato(alder: number): Dayjs {
  return dayjs()
    .subtract(alder, 'years')
    .add(lagTilfeldigInteger(1, 365) - 1, 'days')
}

export function lagTilfeldigTelefonnummer(): string {
  return lagTilfeldigInteger(1, 99_999_999).toString().padEnd(8, '0')
}

dayjs.extend((_, c) => {
  c.prototype.toISODateString = function () {
    return this.format('YYYY-MM-DD')
  }
})

declare module 'dayjs' {
  interface Dayjs {
    toISODateString(): string
  }
}
