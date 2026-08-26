import { Textarea, TextField } from '@navikt/ds-react'
import type { ComponentProps } from 'react'

import classes from './Tekstfelt.module.css'

export function Tekstfelt(props: ComponentProps<typeof TextField>) {
  return <TextField className={classes.tekstfelt} {...props} />
}

export function Tekstområde(props: ComponentProps<typeof Textarea>) {
  return <Textarea className={classes.tekstområde} {...props} />
}
