import dayjs, { Dayjs } from 'dayjs'

export function groupBy<T>(items: T[], keyFn: (value: T) => string): Record<string, T> {
  return items.reduce<Record<string, T>>((records, value) => {
    records[keyFn(value)] = value
    return records
  }, {})
}

export function idGenerator(): () => number {
  let value = 99_999
  return (): number => (value += 1)
}

export const nextId = idGenerator()

export function lagUUID(): string {
  return crypto.randomUUID()
}

export function lagTilfeldigInteger(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function lagTilfeldigDato(year: number): Dayjs {
  const d = dayjs(new Date(year, lagTilfeldigInteger(0, 11), 1))
  const day = lagTilfeldigInteger(1, d.daysInMonth())
  return d.set('day', day)
}

export function lagTilfeldigFødselsdato(age: number): Dayjs {
  return dayjs()
    .subtract(age, 'years')
    .add(lagTilfeldigInteger(1, 365) - 1, 'days')
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
