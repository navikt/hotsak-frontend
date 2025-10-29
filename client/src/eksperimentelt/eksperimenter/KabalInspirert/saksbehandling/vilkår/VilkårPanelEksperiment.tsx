import { Box } from '@navikt/ds-react'
import { Brødtekst, Etikett } from '../../../../../felleskomponenter/typografi'

export function VilkårPanelEksperiment() {
  return (
    <Box.New style={{ height: '100dvh' }} padding={'space-16'} background="default" borderRadius="large large 0 0">
      <Etikett>Vilkår</Etikett>
      <Brødtekst>
        Todo: Her kommer det en sjukt nice vilkårsvurdering. Ingen vurderer vilkår bedre enn dette. De beste vilkårene.
      </Brødtekst>
    </Box.New>
  )
}
