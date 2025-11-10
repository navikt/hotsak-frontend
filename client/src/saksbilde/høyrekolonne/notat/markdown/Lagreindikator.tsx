import { Detail } from '@navikt/ds-react'
import { formaterTidsstempelKort } from '../../../../utils/dato'

export function Lagreindikator(props: { lagrerUtkast: boolean; sistLagretTidspunkt?: string }) {
  const { lagrerUtkast, sistLagretTidspunkt } = props

  console.log('sistLagretTidspunkt', sistLagretTidspunkt)

  if (!sistLagretTidspunkt) {
    return <div style={{ marginLeft: 'auto', marginTop: '2rem' }}></div>
  }

  return (
    <div style={{ marginLeft: 'auto', marginTop: '0.3rem', marginBottom: '0.5rem' }}>
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
