import { Link, type LinkProps } from '@navikt/ds-react'
import type { ReactNode } from 'react'
import { Link as ReactRouterLink, LinkProps as ReactRouterLinkProps } from 'react-router'

export interface RouterLinkProps extends Omit<LinkProps, 'href'> {
  to: ReactRouterLinkProps['to']
  state?: ReactRouterLinkProps['state']
  children: ReactNode
}

export function RouterLink(props: RouterLinkProps) {
  return <Link as={ReactRouterLink} {...props} />
}
