import React from 'react'

import { Tooltip } from '@navikt/ds-react'

interface TooltipWrapperProps {
  visTooltip: boolean
  content: string
  children: React.ReactElement & React.RefAttributes<HTMLElement>
}

export const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  visTooltip,
  content,
  children,
}: TooltipWrapperProps) => {
  if (visTooltip) {
    return <Tooltip content={content}>{children}</Tooltip>
  } else {
    return <>{children}</>
  }
}
