import { BodyShort, Box, Button, HStack } from '@navikt/ds-react'

import { OppgaveTable } from './OppgaveTable.tsx'
import { useEnhetensOppgaver } from './useEnhetensOppgaver.ts'

export function EnhetensOppgaver() {
  const { oppgaver, totalElements, isLoading, isValidating, lastInnFlere } = useEnhetensOppgaver(30)
  return (
    <>
      <Box margin="5">
        <OppgaveTable oppgaver={oppgaver} />
        <HStack align="center" gap="3" justify="center" marginBlock="5">
          {oppgaver.length < totalElements && (
            <Button
              size="small"
              type="button"
              variant="secondary"
              loading={isLoading || isValidating}
              onClick={lastInnFlere}
            >
              Last inn flere
            </Button>
          )}
          <BodyShort>{`Viser ${oppgaver.length} av ${totalElements} oppgaver`}</BodyShort>
        </HStack>
      </Box>
    </>
  )
}
