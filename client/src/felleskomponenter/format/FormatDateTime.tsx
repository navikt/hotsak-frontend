import { useMemo } from 'react'

import classes from './FormatDateTime.module.css'

export interface FormatDateTimeProps {
  dateTime?: string
  dateStyle?: Intl.DateTimeFormatOptions['dateStyle']
  timeStyle?: Intl.DateTimeFormatOptions['timeStyle']
}

export function FormatDateTime(props: FormatDateTimeProps) {
  const { dateTime } = props
  const formatted = useMemo(() => (dateTime ? formatter.format(new Date(dateTime)) : null), [dateTime])
  if (!formatted) {
    return null
  }
  return (
    <time className={classes.root} dateTime={dateTime}>
      {formatted}
    </time>
  )
}

const formatter = new Intl.DateTimeFormat('nb-NO', {
  dateStyle: 'short',
  timeStyle: 'short',
})
