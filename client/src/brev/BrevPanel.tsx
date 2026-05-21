import { Box } from '@navikt/ds-react'

import { DokumentProvider } from '../dokument/DokumentContext.tsx'
import { type Oppgave } from '../oppgave/oppgaveTypes.ts'
import { Brev } from './Brev.tsx'
import classes from './BrevPanel.module.css'

export interface BrevPanelProps {
  oppgave?: Oppgave
}

export function BrevPanel({ oppgave }: BrevPanelProps) {
  return (
    <Box className={classes.container} background="default">
      <DokumentProvider>
        <Brev oppgave={oppgave} />
      </DokumentProvider>
    </Box>
  )
}
