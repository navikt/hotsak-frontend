import { Detail } from '@navikt/ds-react'

import { formaterTidsstempelKort } from '../../../utils/dato'
import classes from './Lagreindikator.module.css'

export function Lagreindikator(props: { lagrerUtkast: boolean; sistLagretTidspunkt?: string }) {
  const { lagrerUtkast, sistLagretTidspunkt } = props

  if (!sistLagretTidspunkt) {
    return <div className={classes.placeholder}></div>
  }

  return (
    <div className={classes.container}>
      {lagrerUtkast ? (
        <Detail textColor="subtle">Lagrer...</Detail>
      ) : (
        <Detail
          data-testid="utkast-lagret"
          textColor="subtle"
        >{`Lagret ${formaterTidsstempelKort(sistLagretTidspunkt)}`}</Detail>
      )}
    </div>
  )
}
