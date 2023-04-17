import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/nb'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isoWeek from 'dayjs/plugin/isoWeek'

dayjs.extend(isoWeek)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

dayjs.locale('nb')

export const NORSK_DATOFORMAT = 'DD.MM.YYYY'
export const NORSK_TIDSPUNKTFORMAT = 'DD.MM.YYYY kl. HH:mm'
export const NORSK_DATOFORMAT_KORT = 'DD.MM.YY'
export const ISO_DATOFORMAT = 'YYYY-MM-DD'
export const ISO_TIDSPUNKTFORMAT = 'YYYY-MM-DDTHH:mm:ss'

export function formaterDato(dato?: string) {
  if (!dato) {
    return ''
  }
  return dayjs(dato, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)
}

export function norskTimestamp(dato: string) {
  return dayjs(dato.endsWith('Z') ? dato : `${dato}Z`).format(NORSK_TIDSPUNKTFORMAT)
}

export function findLatest(dates: Dayjs[]): Dayjs {
  return Array.from(dates)
    .sort((a, b) => (b.isAfter(a) ? -1 : a.isAfter(b) ? 1 : 0))
    .pop()!
}

export function sorterKronologisk(a: string, b: string) {
  const date = dayjs(a, ISO_TIDSPUNKTFORMAT)
  const otherDate = dayjs(b, ISO_TIDSPUNKTFORMAT)
  return date.isAfter(otherDate) ? -1 : otherDate.isAfter(date) ? 1 : 0
}

export function findEarliest(dates: Dayjs[]): Dayjs {
  return Array.from(dates)
    .sort((a, b) => (b.isBefore(a) ? -1 : a.isBefore(b) ? 1 : 0))
    .pop()!
}

export function toDate(value?: Date | number | string): Date | undefined {
  if (!value) return undefined
  return dayjs(value, ISO_DATOFORMAT).toDate()
}
