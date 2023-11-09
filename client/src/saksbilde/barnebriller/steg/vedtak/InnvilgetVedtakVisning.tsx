import { useState } from 'react'

import { Button, Detail } from '@navikt/ds-react'

import { post } from '../../../../io/http'
import { capitalizeName, formaterKontonummer } from '../../../../utils/stringFormating'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Kolonne, Rad } from '../../../../felleskomponenter/Flex'
import { SkjemaAlert } from '../../../../felleskomponenter/SkjemaAlert'
import { Etikett } from '../../../../felleskomponenter/typografi'
import { Barnebrillesak } from '../../../../types/types.internal'
import { VENSTREKOLONNE_BREDDE } from './Vedtak'

interface InnvilgetVedtakVisningProps {
  sak: Barnebrillesak
  mutate: (...args: any[]) => any
}

export const InnvilgetVedtakVisning: React.FC<InnvilgetVedtakVisningProps> = (props) => {
  const [lagrerUtbetalingsmottaker, setLagrerUtbetalingsmottaker] = useState(false)
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
      <Rad>
        <Kolonne $width={VENSTREKOLONNE_BREDDE}>Utbetales til:</Kolonne>
        <Kolonne>
          <Etikett>{capitalizeName(`${sak.utbetalingsmottaker?.navn}`)}</Etikett>
        </Kolonne>
      </Rad>
      {sak.utbetalingsmottaker?.kontonummer ? (
        <Rad>
          <Kolonne $width={VENSTREKOLONNE_BREDDE}>Kontonummer:</Kolonne>
          <Kolonne>
            <Etikett>{formaterKontonummer(sak.utbetalingsmottaker?.kontonummer)}</Etikett>
          </Kolonne>
        </Rad>
      ) : (
        <>
          <SkjemaAlert variant="warning">
            <Etikett>Mangler kontonummer på bruker</Etikett>
            <Detail>
              Personen som har søkt om tilskudd har ikke registrert et kontonummer i NAV sine systemer. Kontakt
              vedkommende for å be dem registrere et kontonummer.
            </Detail>
          </SkjemaAlert>
          <Avstand paddingTop={4} />
          <Button
            variant="secondary"
            size="small"
            loading={lagrerUtbetalingsmottaker}
            disabled={lagrerUtbetalingsmottaker}
            onClick={(e) => {
              e.preventDefault()
              setLagrerUtbetalingsmottaker(true)
              post('/api/utbetalingsmottaker', {
                fnr: sak.utbetalingsmottaker?.fnr,
                sakId: Number(sak.sakId),
              }).then(() => {
                setLagrerUtbetalingsmottaker(false)
                mutate()
              })
            }}
          >
            Hent kontonummer på nytt
          </Button>
        </>
      )}
    </>
  )
}
