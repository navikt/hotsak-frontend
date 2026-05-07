import { type FallbackProps } from 'react-error-boundary'

import { Toppmeny } from '../../header/Toppmeny.tsx'
import { Feilmelding } from './Feilmelding.tsx'
import classes from './GlobalFeilside.module.css'

export type GlobalFeilsideProps = FallbackProps

export function GlobalFeilside(props: GlobalFeilsideProps) {
  return (
    <div className={classes.root}>
      <Toppmeny />
      <Feilmelding {...props} />
    </div>
  )
}
