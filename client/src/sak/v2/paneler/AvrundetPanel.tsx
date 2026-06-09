import { ReactNode } from 'react'
import { Box } from '@navikt/ds-react'

export function AvrundetPanel({ children }: { children: ReactNode }) {
  return (
    <Box
      background="default"
      paddingBlock="space-12 space-0"
      borderRadius="12 12 0 0"
      height="100%"
      borderColor="neutral-subtle"
      borderWidth="1 1 0 1"
    >
      {children}
    </Box>
  )
}
