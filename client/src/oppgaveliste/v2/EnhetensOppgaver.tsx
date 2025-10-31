import { BodyShort, Box, Button, HStack } from '@navikt/ds-react'

import { OppgaveGjelderFilter, Oppgaveprioritet, Oppgavetype } from '../../oppgave/oppgaveTypes.ts'
import { OppgaveFilter } from './OppgaveFilter.tsx'
import { OppgaveTable } from './OppgaveTable.tsx'
import { useEnhetensOppgaver } from './useEnhetensOppgaver.ts'

export function EnhetensOppgaver() {
  const { oppgaver, lastInnFlere, totalElements } = useEnhetensOppgaver(30)
  return (
    <>
      <Box margin="5">
        <OppgaveFilter oppgavetyper={oppgavetyper} gjelder={gjelder} oppgaveprioritet={oppgaveprioritet} />
        <OppgaveTable oppgaver={oppgaver} />
        <HStack align="center" gap="3" justify="center" marginBlock="5">
          <Button size="small" type="button" variant="secondary" onClick={lastInnFlere}>
            Last inn flere
          </Button>
          <BodyShort>{`Viser ${oppgaver.length} av ${totalElements} oppgaver`}</BodyShort>
        </HStack>
      </Box>
    </>
  )
}

const oppgavetyper = Object.values(Oppgavetype)
const gjelder = Object.values(OppgaveGjelderFilter)
const oppgaveprioritet = Object.values(Oppgaveprioritet)
