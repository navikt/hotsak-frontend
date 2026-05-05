import type { ReactNode } from 'react'

import classes from './AlertContainer.module.css'

export function AlertContainerMedium({ children }: { children: ReactNode }) {
  return <div className={classes.alertContainerMedium}>{children}</div>
}
