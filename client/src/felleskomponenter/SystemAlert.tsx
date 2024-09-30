import { Alert, Box } from '@navikt/ds-react'
import { ReactNode } from 'react'

export function SystemAlert({ children }: { children?: ReactNode }) {
  return (
    <Box paddingBlock="0 6">
      <Alert variant="warning" size="small" fullWidth>
        {children}
      </Alert>
    </Box>
  )
}
