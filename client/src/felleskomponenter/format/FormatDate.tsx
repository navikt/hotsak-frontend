import { useMemo } from 'react'

import classes from './FormatDate.module.css'

export function FormatDate({ date }: { date?: string }) {
  const formatted = useMemo(() => (date ? formatter.format(new Date(date)) : null), [date])
  if (!formatted) {
    return null
  }
  return (
    <time className={classes.root} dateTime={date}>
      {formatted}
    </time>
  )
}

const formatter = new Intl.DateTimeFormat('nb-NO', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
