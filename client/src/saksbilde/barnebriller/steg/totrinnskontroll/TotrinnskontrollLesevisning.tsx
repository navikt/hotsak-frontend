import { InlineMessage, VStack } from '@navikt/ds-react'

import { Etikett, Tekst } from '../../../../felleskomponenter/typografi'
import { OppgaveStatusType, TotrinnskontrollVurdering } from '../../../../types/types.internal'
import { formaterDato } from '../../../../utils/dato'
import { storForbokstavIAlleOrd } from '../../../../utils/formater'
import { useBarnebrillesak } from '../../../useBarnebrillesak'

export function TotrinnskontrollLesevisning() {
  const { sak } = useBarnebrillesak()

  return (
    <VStack gap="space-12">
      <div>
        <Etikett>Vurdering</Etikett>
        <Tekst>{storForbokstavIAlleOrd(sak?.data.totrinnskontroll?.resultat)}</Tekst>
      </div>
      {sak?.data.totrinnskontroll?.begrunnelse && (
        <div>
          <Etikett>Begrunn vurderingen din</Etikett>
          <Tekst>{sak.data.totrinnskontroll.begrunnelse}</Tekst>
        </div>
      )}
      {sak?.data.totrinnskontroll?.resultat === TotrinnskontrollVurdering.RETURNERT && (
        <InlineMessage role="status" size="small" status="info">
          Sendt i retur til saksbehandler {formaterDato(sak?.data.totrinnskontroll?.opprettet)}
        </InlineMessage>
      )}
      {sak?.data.totrinnskontroll?.resultat === TotrinnskontrollVurdering.GODKJENT &&
        sak.data.saksstatus === OppgaveStatusType.VEDTAK_FATTET && (
          <InlineMessage role="status" size="small" status="success">
            Vedtaket er fattet {formaterDato(sak?.data.vedtak?.vedtaksdato)}
          </InlineMessage>
        )}
    </VStack>
  )
}
