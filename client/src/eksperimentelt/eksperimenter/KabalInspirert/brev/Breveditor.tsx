import { Box } from '@navikt/ds-react'
import { Brødtekst, Etikett } from '../../../../felleskomponenter/typografi'

export function Breveditor() {
  return (
    <Box.New padding="space-16">
      <Etikett>Breveditor</Etikett>
      <Brødtekst>Todo: Her kommer det en sjukt nice breveditor</Brødtekst>
    </Box.New>
  )
}
