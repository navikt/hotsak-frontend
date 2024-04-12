import { compareAsc, format, parseISO, setDefaultOptions, toDate } from 'date-fns'
import { nb } from 'date-fns/locale'

setDefaultOptions({ locale: nb })

export function formaterDato(dato?: string): string {
  if (!dato) return ''
  return format(dato, 'P')
}

export function norskTimestamp(dato: string): string {
  return format(dato.endsWith('Z') ? dato : dato + 'Z', 'Pp')
}

export function tilDato(value?: Date | number | string): Date | undefined {
  if (!value) return
  return toDate(value)
}

export function sorterKronologisk(a: string, b: string): number {
  return compareAsc(parseISO(a), parseISO(b))
}
