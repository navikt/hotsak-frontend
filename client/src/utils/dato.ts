import {
  compareAsc,
  compareDesc,
  differenceInYears,
  format,
  formatDistanceToNow,
  parseISO,
  setDefaultOptions,
  toDate,
} from 'date-fns'
import { nb } from 'date-fns/locale'

setDefaultOptions({ locale: nb })

export function formaterDato(dato?: string): string {
  if (!dato) return ''
  return format(dato, 'P')
}

export function formaterTidsstempel(dato?: string): string {
  if (!dato) return ''

  return format(dato.endsWith('Z') ? dato : dato + 'Z', 'Pp')
}

export function formaterTidsstempelLesevennlig(dato?: string): string {
  if (!dato) return ''

  return format(dato.endsWith('Z') ? dato : dato + 'Z', "dd.MM.yyyy 'kl.' HH.mm")
}

export function formaterRelativTid(dato?: string): string {
  if (!dato) return ''
  const parsedDate = dato.endsWith('Z') ? parseISO(dato) : parseISO(dato + 'Z')
  //if (isToday(date)) {
  //  return `I dag kl ${format(date, 'HH:mm')}`
  //}
  return formatDistanceToNow(parsedDate, { addSuffix: true, locale: nb }).replace('omtrent', '')
}

export function formaterTidsstempelKort(dato?: string): string {
  if (!dato) return ''

  return format(dato.endsWith('Z') ? dato : dato + 'Z', "dd.MM 'kl.' HH.mm")
}

export function tilDato(verdi?: Date | number | string): Date | undefined {
  if (!verdi) return
  return toDate(verdi)
}

export function sorterKronologiskStigende(a: string, b: string): number {
  return compareAsc(parseISO(a), parseISO(b))
}

export function sorterKronologiskSynkende(a: string, b: string): number {
  return compareDesc(parseISO(a), parseISO(b))
}

export function beregnAlder(fødselsdato: Date | number | string) {
  return differenceInYears(new Date(), fødselsdato)
}
