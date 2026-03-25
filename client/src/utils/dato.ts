import {
  compareAsc,
  compareDesc,
  type DateArg,
  differenceInYears,
  type Duration,
  format,
  formatDistance,
  formatISO,
  formatISODuration,
  isDate,
  isToday,
  parseISO,
  setDefaultOptions,
  toDate,
} from 'date-fns'

import { nb } from 'date-fns/locale'

import { isNumber } from './type.ts'

setDefaultOptions({ locale: nb })

type Dato = DateArg<Date>

export function formaterDato(dato?: Dato): string {
  if (!dato) return ''
  return format(dato, 'P')
}

export function formaterDatoKort(dato?: Dato): string {
  if (!dato) return ''
  return format(dato, 'dd.MM.yy')
}

export function formaterDatoLang(dato?: Dato): string {
  if (!dato) return ''
  return format(dato, 'PPP')
}

export function formaterTidsstempel(dato?: string): string {
  if (!dato) return ''
  return format(dato.endsWith('Z') ? dato : dato + 'Z', 'Pp')
}

export function formaterTidsstempelLang(dato?: string): string {
  if (!dato) return ''
  return format(dato.endsWith('Z') ? dato : dato + 'Z', "dd.MM.yyyy 'kl.' HH.mm")
}

export function formaterTidsstempelKort(dato?: string): string {
  if (!dato) return ''
  return format(dato.endsWith('Z') ? dato : dato + 'Z', "dd.MM 'kl.' HH.mm")
}

export function formaterRelativTid(dato?: string): string {
  if (!dato) return ''
  const parsedDate = dato.endsWith('Z') ? parseISO(dato) : parseISO(dato + 'Z')
  if (isToday(dato)) {
    return `I dag kl ${format(dato, 'HH:mm')}`
  }
  const now = new Date()
  return formatDistance(parsedDate, now, { addSuffix: true, locale: nb }).replace('omtrent', '')
}

export function tilDato(dato?: Dato): Date | undefined {
  if (!dato) return
  return toDate(dato)
}

export function tilLocalDateString(dato: Dato = new Date()): string {
  return formatISO(dato, { representation: 'date' })
}

export function sorterKronologiskStigende(a: string, b: string): number {
  return compareAsc(parseISO(a), parseISO(b))
}

export function sorterKronologiskSynkende(a: string, b: string): number {
  return compareDesc(parseISO(a), parseISO(b))
}

export function beregnAlder(fødselsdato: Dato) {
  return differenceInYears(new Date(), fødselsdato)
}

export type IntervalString = `${string}/${string}`
export function intervalString(fra: Date | Duration | string, til: Date | Duration | string): IntervalString {
  if (isDate(fra)) {
    fra = fra.toISOString()
  } else if (isDuration(fra)) {
    fra = formatISODuration(fra)
  }
  if (isDate(til)) {
    til = til.toISOString()
  } else if (isDuration(til)) {
    til = formatISODuration(til)
  }
  return `${fra}/${til}`
}

function isDuration(value: unknown): value is Duration {
  if (value == null) return false
  if (isDate(value)) return false
  const duration = value as Duration
  return (
    isNumber(duration.years) ||
    isNumber(duration.months) ||
    isNumber(duration.weeks) ||
    isNumber(duration.days) ||
    isNumber(duration.hours) ||
    isNumber(duration.minutes) ||
    isNumber(duration.seconds)
  )
}
