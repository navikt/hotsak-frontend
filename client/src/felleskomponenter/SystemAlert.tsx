import { Alert, Box } from '@navikt/ds-react'
import { ReactNode } from 'react'

export function SystemAlert({ children }: { children?: ReactNode }) {
  return (
    <Box>
      <Alert variant="warning" size="small" fullWidth>
        {children}
      </Alert>
    </Box>
  )
}
