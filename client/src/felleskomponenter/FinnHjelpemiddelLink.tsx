import { Link } from '@navikt/ds-react'
import { ReactNode } from 'react'

export const FinnHjelpemiddelLink = ({ hmsnr, variant = 'action', children }: FinnHjelpemiddelLinkProps) => {
  return (
    <Link variant={variant} href={`https://finnhjelpemiddel.nav.no/${hmsnr}`} target="_blank">
      {children}
    </Link>
  )
}

interface FinnHjelpemiddelLinkProps {
  hmsnr: string
  variant?: 'action' | 'neutral'
  children: ReactNode
}
