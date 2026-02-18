import { HGrid } from '@navikt/ds-react'
import { Etikett } from '../../../../felleskomponenter/typografi'
import { Barnebrillesak } from '../../../../types/types.internal'
import { formaterBeløp, formaterKontonummer, formaterNavn } from '../../../../utils/formater.ts'
import { UtbetalingsmottakerAlert } from './Utbetalingsmottaker'

export interface InnvilgetVedtakVisningProps {
  sak: Barnebrillesak
  lesevisning?: boolean
  mutate(...args: any[]): any
}

export function InnvilgetVedtakVisning(props: InnvilgetVedtakVisningProps) {
  const { sak, lesevisning, mutate } = props
  const { vilkårsvurdering, utbetalingsmottaker } = sak
  return (
    <>
      <HGrid gap="space-8" columns="180px auto">
        <div>{`${vilkårsvurdering?.data?.sats.replace('SATS_', 'Sats ')}:`}</div>
        <Etikett>{`${formaterBeløp(vilkårsvurdering?.data?.satsBeløp)} kr`}</Etikett>
        <div>Beløp som utbetales:</div>
        <Etikett>{formaterBeløp(vilkårsvurdering?.data?.beløp)} kr</Etikett>
        {utbetalingsmottaker?.fnr && (
          <>
            <div>Utbetales til:</div>
            <Etikett>{formaterNavn(utbetalingsmottaker?.navn) || '-'}</Etikett>
            <div>Kontonummer:</div>
            <Etikett>{formaterKontonummer(utbetalingsmottaker?.kontonummer) || 'Kontonummer mangler'}</Etikett>
          </>
        )}
      </HGrid>
      {!lesevisning && (
        <UtbetalingsmottakerAlert sakId={sak.sakId} utbetalingsmottaker={sak.utbetalingsmottaker} mutate={mutate} />
      )}
    </>
  )
}
