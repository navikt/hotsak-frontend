import { storForbokstavIAlleOrd } from '../../../../utils/formater'

import { Box } from '@navikt/ds-react'
import { Etikett, Tekst } from '../../../../felleskomponenter/typografi'
import { Vilkår } from '../../../../types/types.internal'

export function SaksbehandlersVurderingLesevisning({ vilkår }: { sakId: number | string; vilkår: Vilkår }) {
  return (
    <Box paddingBlock="6 0">
      <Etikett>Er vilkåret oppfylt?</Etikett>
      <Tekst>{storForbokstavIAlleOrd(vilkår.vilkårOppfylt).replace('_', ' ')}</Tekst>
      {vilkår.manuellVurdering?.begrunnelse && (
        <Box paddingBlock="6 0">
          <Etikett>Begrunnelse</Etikett>
          <Tekst>{vilkår.manuellVurdering.begrunnelse}</Tekst>
        </Box>
      )}
    </Box>
  )
}
