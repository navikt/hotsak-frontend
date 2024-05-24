import type { ReactElement, RefAttributes } from 'react'

import { Tooltip } from '@navikt/ds-react'

interface TooltipWrapperProps {
  visTooltip: boolean
  content: string
  children: ReactElement & RefAttributes<HTMLElement>
}

export function TooltipWrapper({ visTooltip, content, children }: TooltipWrapperProps) {
  if (visTooltip) {
    return <Tooltip content={content}>{children}</Tooltip>
  } else {
    return <>{children}</>
  }
}
