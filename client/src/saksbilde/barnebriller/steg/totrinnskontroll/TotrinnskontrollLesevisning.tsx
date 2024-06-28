import { Alert, VStack } from '@navikt/ds-react'

import { Brødtekst, Etikett } from '../../../../felleskomponenter/typografi'
import { OppgaveStatusType, TotrinnskontrollVurdering } from '../../../../types/types.internal'
import { formaterDato } from '../../../../utils/dato'
import { storForbokstavIAlleOrd } from '../../../../utils/formater'
import { useBarnebrillesak } from '../../../useBarnebrillesak'

export function TotrinnskontrollLesevisning() {
  const { sak } = useBarnebrillesak()

  return (
    <VStack gap="3">
      <div>
        <Etikett>Vurdering</Etikett>
        <Brødtekst>{storForbokstavIAlleOrd(sak?.data.totrinnskontroll?.resultat)}</Brødtekst>
      </div>
      {sak?.data.totrinnskontroll?.begrunnelse && (
        <div>
          <Etikett>Begrunn vurderingen din</Etikett>
          <Brødtekst>{sak.data.totrinnskontroll.begrunnelse}</Brødtekst>
        </div>
      )}
      {sak?.data.totrinnskontroll?.resultat === TotrinnskontrollVurdering.RETURNERT && (
        <Alert role="status" size="small" variant="info">
          Sendt i retur til saksbehandler {formaterDato(sak?.data.totrinnskontroll?.opprettet)}
        </Alert>
      )}
      {sak?.data.totrinnskontroll?.resultat === TotrinnskontrollVurdering.GODKJENT &&
        sak.data.status === OppgaveStatusType.VEDTAK_FATTET && (
          <Alert role="status" size="small" variant="success">
            Vedtaket er fattet {formaterDato(sak?.data.vedtak?.vedtaksdato)}
          </Alert>
        )}
    </VStack>
  )
}
