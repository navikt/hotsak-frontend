import { capitalize } from '../../../../utils/stringFormating'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Brødtekst, Etikett } from '../../../../felleskomponenter/typografi'
import { Vilkår } from '../../../../types/types.internal'

export function SaksbehandlersVurderingLesevisning({ vilkår }: { sakId: number | string; vilkår: Vilkår }) {
  return (
    <Avstand paddingTop={6}>
      <Etikett>Er vilkåret oppfylt?</Etikett>
      <Brødtekst>
        {capitalize(vilkår.resultatSaksbehandler ? vilkår.resultatSaksbehandler : vilkår.resultatAuto)}
      </Brødtekst>
      {vilkår.begrunnelseSaksbehandler && (
        <Avstand paddingTop={6}>
          <Etikett>Begrunnelse</Etikett>
          <Brødtekst>{vilkår.begrunnelseSaksbehandler}</Brødtekst>
        </Avstand>
      )}
    </Avstand>
  )
}
