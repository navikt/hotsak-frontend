import { Alert } from '@navikt/ds-react'

import { VilkårsResultat } from '../../../../../types/types.internal'
import { alertVariant, vilkårStatusTekst } from '../oppsummertStatus'
import { Brødtekst } from '../../../../../felleskomponenter/typografi'

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
      <Alert variant={`${alertVariant(vilkårOppfylt)}`} size="small" inline>
        <Brødtekst>{vilkårStatusTekst(vilkårOppfylt)}</Brødtekst>
      </Alert>
    )
  }
}
