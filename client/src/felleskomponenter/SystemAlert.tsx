import { Alert, Box } from '@navikt/ds-react'
import { ReactNode } from 'react'

export function SystemAlert({ children, variant = 'warning' }: { children?: ReactNode; variant?: 'warning' | 'info' }) {
  return (
    <Box paddingBlock="0 6">
      <Alert variant={variant} size="small" fullWidth>
        {children}
      </Alert>
    </Box>
  )
}
