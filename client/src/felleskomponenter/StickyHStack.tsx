import { Box, HStack, type HStackProps } from '@navikt/ds-react'
import clsx from 'clsx'

import classes from './StickyHStack.module.css'

type StickyHStackProps = Omit<
  HStackProps,
  'as' | 'asChild' | 'position' | 'left' | 'bottom' | 'width' | 'height' | 'flexGrow' | 'flexShrink'
>

export function StickyHStack({ children, className, ...rest }: StickyHStackProps) {
  return (
    <HStack
      {...rest}
      asChild
      position="sticky"
      left="space-0"
      bottom="space-0"
      width="100%"
      height="fit-content"
      flexGrow="0"
      flexShrink="0"
    >
      <Box
        background="default"
        borderWidth="1 0 0 0"
        borderColor="neutral-subtle"
        className={clsx(classes.root, className)}
      >
        {children}
      </Box>
    </HStack>
  )
}
