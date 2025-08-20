import { HStack, StackProps } from '@navikt/ds-react'
import { ReactNode } from 'react'

export function Knappepanel({
  children,
  gap,
  marginBlock,
}: {
  children: ReactNode
  gap?: StackProps['gap']
  marginBlock?: StackProps['marginBlock']
}) {
  return (
    <HStack gap={gap ? gap : 'space-16'} marginBlock={marginBlock ? marginBlock : 'space-24 0'}>
      {children}
    </HStack>
  )
}
