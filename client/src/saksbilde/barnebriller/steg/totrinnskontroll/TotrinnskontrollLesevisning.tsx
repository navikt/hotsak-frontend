import React from 'react'

import { Alert } from '@navikt/ds-react'

import { formaterDato } from '../../../../utils/date'
import { capitalize } from '../../../../utils/stringFormating'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Brødtekst, Etikett } from '../../../../felleskomponenter/typografi'
import { OppgaveStatusType } from '../../../../types/types.internal'
import { useBrillesak } from '../../../sakHook'

export const TotrinnskontrollLesevisning: React.FC = () => {
  const { sak } = useBrillesak()

  return (
    <>
      <Etikett>Vurdering</Etikett>
      <Brødtekst>{capitalize(sak?.totrinnskontroll?.resultat)}</Brødtekst>

      {sak?.totrinnskontroll?.begrunnelse && (
        <>
          <Etikett>Begrunn vurderingen din</Etikett>
          <Brødtekst>{sak.totrinnskontroll.begrunnelse}</Brødtekst>
        </>
      )}

      <Avstand paddingTop={4}>
        {sak?.totrinnskontroll?.resultat === 'RETURNERT' && (
          <Alert size="small" variant="info">
            Sendt i retur til saksbehandler {formaterDato(sak?.totrinnskontroll?.opprettet)}
          </Alert>
        )}
        {sak?.totrinnskontroll?.resultat === 'GODKJENT' && sak.status === OppgaveStatusType.VEDTAK_FATTET && (
          <Alert size="small" variant="success">
            Vedtaket er fattet {formaterDato(sak?.vedtak?.vedtaksdato)}
          </Alert>
        )}
      </Avstand>
    </>
  )
}
