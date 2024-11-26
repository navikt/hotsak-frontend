import { compareAsc, differenceInYears, format, parseISO, setDefaultOptions, toDate } from 'date-fns'
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

export function tilDato(verdi?: Date | number | string): Date | undefined {
  if (!verdi) return
  return toDate(verdi)
}

export function sorterKronologisk(a: string, b: string): number {
  return compareAsc(parseISO(a), parseISO(b))
}

export function beregnAlder(fødselsdato: Date | number | string) {
  return differenceInYears(new Date(), fødselsdato)
}
