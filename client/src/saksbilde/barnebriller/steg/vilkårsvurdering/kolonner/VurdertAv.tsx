import { Tekst } from '../../../../../felleskomponenter/typografi'
import { VilkårsResultat } from '../../../../../types/types.internal'

export const VurdertAv = ({
  vilkårOppfylt,
  resultatSaksbehandler,
}: {
  vilkårOppfylt?: VilkårsResultat
  resultatSaksbehandler?: VilkårsResultat
}) => {
  if (!vilkårOppfylt) {
    return <Tekst>Ikke grunnlag for vurdering</Tekst>
  } else if (vilkårOppfylt === VilkårsResultat.OPPLYSNINGER_MANGLER) {
    return <Tekst>-</Tekst>
  } else {
    return <Tekst>{resultatSaksbehandler ? 'Saksbehandler' : 'Automatisk - basert på saksbehandlers input'}</Tekst>
  }
}
