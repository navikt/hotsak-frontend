import type { ReactNode } from 'react'
import classes from './ResponsiveStack.module.css'

export function ResponsiveStack({ children }: { children: ReactNode }) {
  return (
    <div className={classes.container}>
      <div className={classes.layout}>{children}</div>
    </div>
  )
}
