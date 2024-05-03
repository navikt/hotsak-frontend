import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Kolonne, Rad } from '../../../../felleskomponenter/Flex'
import { Etikett } from '../../../../felleskomponenter/typografi'
import { Barnebrillesak } from '../../../../types/types.internal'
import { UtbetalingsmottakerVisning } from './Utbetalingsmottaker'
import { VENSTREKOLONNE_BREDDE } from './Vedtak'

export interface InnvilgetVedtakVisningProps {
  sak: Barnebrillesak
  mutate: (...args: any[]) => any
}

export function InnvilgetVedtakVisning(props: InnvilgetVedtakVisningProps) {
  const { sak, mutate } = props
  const { vilkårsvurdering } = sak
  return (
    <>
      <Avstand paddingBottom={6} />
      <Rad>
        <Kolonne $width={VENSTREKOLONNE_BREDDE}>{`${vilkårsvurdering?.data?.sats.replace('SATS_', 'Sats ')}:`}</Kolonne>
        <Kolonne>
          <Etikett>{`${vilkårsvurdering?.data?.satsBeløp} kr`}</Etikett>
        </Kolonne>
      </Rad>
      <Rad>
        <Kolonne $width={VENSTREKOLONNE_BREDDE}>Beløp som utbetales:</Kolonne>
        <Kolonne>
          <Etikett>{vilkårsvurdering?.data?.beløp} kr</Etikett>
        </Kolonne>
      </Rad>
      <UtbetalingsmottakerVisning sakId={sak.sakId} utbetalingsmottaker={sak.utbetalingsmottaker} mutate={mutate} />
    </>
  )
}
