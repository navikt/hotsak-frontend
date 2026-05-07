import { Box } from '@navikt/ds-react'
import { DokumentProvider } from '../dokument/DokumentContext.tsx'
import { Brev } from './Brev.tsx'
import classes from './BrevPanel.module.css'

export function BrevPanel() {
  return (
    <Box className={classes.container} background="default">
      <DokumentProvider>
        <Brev />
      </DokumentProvider>
    </Box>
  )
}
