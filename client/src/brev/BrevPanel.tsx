import { Box } from '@navikt/ds-react'
import { DokumentProvider } from '../dokument/DokumentContext.tsx'
import { Brev } from './Brev.tsx'

export function BrevPanel() {
  return (
    <Box style={{ height: '100%' }} background="default">
      <DokumentProvider>
        <Brev />
      </DokumentProvider>
    </Box>
  )
}
