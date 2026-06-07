import { Box } from '@navikt/ds-react'

import { DokumentProvider } from '../dokument/DokumentContext.tsx'
import { type Saksbehandlingsoppgave } from '../oppgave/oppgaveTypes.ts'
import { Brev } from './Brev.tsx'
import classes from './BrevPanel.module.css'
import { type Brev as BrevType } from './brevTyper.ts'

export interface BrevPanelProps {
  oppgave?: Saksbehandlingsoppgave
  brev?: BrevType
}

export function BrevPanel({ oppgave, brev }: BrevPanelProps) {
  return (
    <Box className={classes.container} background="default">
      <DokumentProvider>
        <Brev oppgave={oppgave} brevId={brev?.brevId} />
      </DokumentProvider>
    </Box>
  )
}
