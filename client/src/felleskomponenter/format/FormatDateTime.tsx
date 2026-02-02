import { useMemo } from 'react'

import classes from './FormatDateTime.module.css'

export function FormatDateTime({ dateTime }: { dateTime?: string }) {
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
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})
