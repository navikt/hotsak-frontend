import { ExclamationmarkTriangleIcon, InformationSquareIcon } from '@navikt/aksel-icons'
import { Tag } from '@navikt/ds-react'
import { type ReactNode } from 'react'

import classes from './AlertTag.module.css'

interface AlertTagProps {
  children: ReactNode
  langTekst?: boolean
}

export function WarningTag({ children, langTekst = false }: AlertTagProps) {
  return (
    <Tag
      className={classes.root}
      size="small"
      data-color="warning"
      variant="moderate"
      icon={<ExclamationmarkTriangleIcon aria-hidden />}
      style={langTekst ? { padding: 'var(--ax-space-8)', lineHeight: 'var(--ax-line-height-1)' } : undefined}
    >
      {children}
    </Tag>
  )
}

export function InfoTag({ children, langTekst = false }: AlertTagProps) {
  return (
    <Tag
      className={classes.root}
      size="small"
      data-color="info"
      variant="moderate"
      icon={<InformationSquareIcon aria-hidden />}
      style={langTekst ? { padding: 'var(--ax-space-8)', lineHeight: 'var(--ax-line-height-1)' } : undefined}
    >
      {children}
    </Tag>
  )
}
