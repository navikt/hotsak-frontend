import { BodyShort, Box, Button, HGrid, HStack } from '@navikt/ds-react'

import { OppgaveColumnMenu } from './OppgaveColumnMenu.tsx'
import { TrashIcon } from '@navikt/aksel-icons'

export interface OppgaveToolbarProps {
  text: string
}

export function OppgaveToolbar(props: OppgaveToolbarProps) {
  const { text } = props
  return (
    <Box.New borderColor="neutral-subtleA" borderWidth="0 0 2 0" padding="2">
      <HGrid columns="1fr 1fr 1fr">
        <div />
        <BodyShort align="center">{text}</BodyShort>
        <HStack gap="2" justify="end">
          <OppgaveColumnMenu />
          <Button variant="tertiary-neutral" icon={<TrashIcon />} size="xsmall">
            Nullstill tabell
          </Button>
        </HStack>
      </HGrid>
    </Box.New>
  )
}
