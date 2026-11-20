import { type ReactNode } from 'react'
import { Box, type BoxProps } from '@navikt/ds-react'

export function AvrundetPanel({
  children,
  paddingBlock,
}: {
  children: ReactNode
  paddingBlock?: BoxProps['paddingBlock']
}) {
  return (
    <Box
      background="default"
      paddingBlock={paddingBlock ?? 'space-12 space-0'}
      borderRadius="12 12 0 0"
      height="100%"
      style={{ overflow: 'clip' }}
      borderColor="neutral-subtle"
      borderWidth="1 1 0 1"
    >
      {children}
    </Box>
  )
}
