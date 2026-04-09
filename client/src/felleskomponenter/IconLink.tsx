import { HStack, Link, type LinkProps } from '@navikt/ds-react'
import { type ReactNode } from 'react'

export interface IconLinkProps extends Pick<LinkProps, 'children' | 'href' | 'target'> {
  icon: ReactNode
}

export function IconLink(props: IconLinkProps) {
  const { icon, children, ...rest } = props
  return (
    <HStack as={Link} align="center" gap="space-6" wrap={false} {...rest}>
      {children}
      {icon}
    </HStack>
  )
}
