import { Brødtekst } from '../../../../../felleskomponenter/typografi'
import { VilkårsResultat } from '../../../../../types/types.internal'

export const VurdertAv = ({
  vilkårOppfylt,
  resultatSaksbehandler,
}: {
  vilkårOppfylt?: VilkårsResultat
  resultatSaksbehandler?: VilkårsResultat
}) => {
  if (!vilkårOppfylt) {
    return <Brødtekst>Ikke grunnlag for vurdering</Brødtekst>
  } else if (vilkårOppfylt === VilkårsResultat.DOKUMENTASJON_MANGLER) {
    return <Brødtekst>-</Brødtekst>
  } else {
    return (
      <Brødtekst>{resultatSaksbehandler ? 'Saksbehandler' : 'Automatisk - basert på saksbehandlers input'}</Brødtekst>
    )
  }
}
