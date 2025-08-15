import { storForbokstavIAlleOrd } from '../../../../utils/formater'

import { Box } from '@navikt/ds-react'
import { Brødtekst, Etikett } from '../../../../felleskomponenter/typografi'
import { Vilkår } from '../../../../types/types.internal'

export function SaksbehandlersVurderingLesevisning({ vilkår }: { sakId: number | string; vilkår: Vilkår }) {
  return (
    <Box paddingBlock="6 0">
      <Etikett>Er vilkåret oppfylt?</Etikett>
      <Brødtekst>{storForbokstavIAlleOrd(vilkår.vilkårOppfylt).replace('_', ' ')}</Brødtekst>
      {vilkår.manuellVurdering?.begrunnelse && (
        <Box paddingBlock="6 0">
          <Etikett>Begrunnelse</Etikett>
          <Brødtekst>{vilkår.manuellVurdering.begrunnelse}</Brødtekst>
        </Box>
      )}
    </Box>
  )
}
