import { ExclamationmarkTriangleIcon, InformationSquareIcon } from '@navikt/aksel-icons'
import { Tag } from '@navikt/ds-react'
import { ReactNode } from 'react'
import classes from './AlertTag.module.css'

interface AlertTagProps {
  children: ReactNode
}

export function WarningTag({ children }: AlertTagProps) {
  return (
    <Tag
      className={classes.root}
      size="small"
      data-color="warning"
      variant="moderate"
      icon={<ExclamationmarkTriangleIcon aria-hiden />}
    >
      {children}
    </Tag>
  )
}

export function InfoTag({ children }: AlertTagProps) {
  return (
    <Tag
      className={classes.root}
      size="small"
      data-color="info"
      variant="moderate"
      icon={<InformationSquareIcon aria-hidden />}
    >
      {children}
    </Tag>
  )
}
