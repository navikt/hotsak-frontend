import { Link } from '@navikt/ds-react'
import { ReactNode } from 'react'

export const FinnHjelpemiddelLink = ({ hmsnr, children }: FinnHjelpemiddelLinkProps) => {
  return (
    <Link href={`https://finnhjelpemiddel.nav.no/${hmsnr}`} target="_blank">
      {children}
    </Link>
  )
}

interface FinnHjelpemiddelLinkProps {
  hmsnr: string
  children: ReactNode
}
