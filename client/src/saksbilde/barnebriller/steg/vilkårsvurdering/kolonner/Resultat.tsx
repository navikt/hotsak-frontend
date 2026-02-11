import { Alert } from '@navikt/ds-react'

import { Tekst } from '../../../../../felleskomponenter/typografi'
import { VilkårsResultat } from '../../../../../types/types.internal'
import { alertVariant, vilkårStatusTekst } from '../oppsummertStatus'

export const Resultat = ({
  vilkårOppfylt,
}: {
  vilkårOppfylt?: VilkårsResultat
  resultatSaksbehandler?: VilkårsResultat
}) => {
  if (!vilkårOppfylt) {
    return <>{vilkårStatusTekst(vilkårOppfylt)}</>
  } else {
    return (
      <Alert data-testid="alert-vilkårstatus" variant={`${alertVariant(vilkårOppfylt)}`} size="small" inline>
        <Tekst>{vilkårStatusTekst(vilkårOppfylt)}</Tekst>
      </Alert>
    )
  }
}
