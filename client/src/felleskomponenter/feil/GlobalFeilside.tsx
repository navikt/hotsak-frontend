import { type FallbackProps } from 'react-error-boundary'

import { Toppmeny } from '../../header/Toppmeny.tsx'
import { Feilmelding } from './Feilmelding.tsx'
import classes from './GlobalFeilside.module.css'

export type GlobalFeilsideFallbackProps = FallbackProps

export function GlobalFeilside(props: GlobalFeilsideFallbackProps) {
  return (
    <div className={classes.root}>
      <Toppmeny />
      <Feilmelding {...props} />
    </div>
  )
}
