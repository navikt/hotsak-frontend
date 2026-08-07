import { Tekst } from '../../../../../felleskomponenter/typografi'
import { VilkårsResultat } from '../../../../../types/types.internal'
import { alertVariant, vilkårStatusTekst } from '../oppsummertStatus'
import { InlineMessage } from '@navikt/ds-react'

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
      <InlineMessage data-testid="alert-vilkårstatus" status={`${alertVariant(vilkårOppfylt)}`} size="small">
        <Tekst>{vilkårStatusTekst(vilkårOppfylt)}</Tekst>
      </InlineMessage>
    )
  }
}
