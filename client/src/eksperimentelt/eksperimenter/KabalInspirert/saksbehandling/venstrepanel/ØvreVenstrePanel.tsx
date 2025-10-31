import { Box } from '@navikt/ds-react'
import { SøknadsinfoEksperiment } from './SøknadsinfoEksperiment'

export function ØvreVenstrePanel() {
  return (
    <Box.New background="default" borderRadius="large" style={{ overflow: 'auto' }} padding="space-16">
      <SøknadsinfoEksperiment />
    </Box.New>
  )
}
